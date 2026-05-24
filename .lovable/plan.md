# Build plan

Three pieces of work, delivered in this order so each one is testable on its own.

---

## 1. Fix checkout (small)

Symptom: clicking Checkout lands on a Shopify *store* page instead of the hosted checkout.

Fix:
- Audit `src/components/CartDrawer.tsx` and `src/stores/cartStore.ts` to make sure we use the `checkoutUrl` returned by Shopify's `cartCreate` / `cartLinesAdd` mutation, with `?channel=online_store` appended, opened in a new tab.
- If `checkoutUrl` is missing (cart was cleared/expired), recreate the cart before opening.

---

## 2. Media performance (medium)

Goal: load like casegear.in (instant first paint, smooth scroll).

- Convert hero/banner JPGs to **AVIF + WebP** via `vite-imagetools`; serve with `<picture>`.
- Add `fetchpriority="high"` + `loading="eager"` on the first hero slide only; everything else `loading="lazy"` with explicit `width`/`height` (prevents CLS).
- Use Shopify CDN image URLs with `?width=…&format=webp` query params for product images (Shopify auto-transforms).
- For videos: ensure `preload="metadata"`, `playsinline`, and use a poster image; lazy-mount via `IntersectionObserver` (already partly in `LazyVideo`).
- Preconnect Shopify CDN (`cdn.shopify.com`) in `index.html`.

---

## 3. Private admin panel (large)

A separate `/admin` area, gated by email+password login. Only users with the `admin` role can enter — no public signup.

### Auth & roles
- Enable email+password auth (Lovable Cloud). Disable public signup.
- Tables: `user_roles` with enum `app_role`, plus a `has_role()` security-definer function (per security best practices).
- You (the owner) get seeded as `admin` via a one-time SQL insert after first login.
- `/admin/*` routes wrapped in a guard that checks `has_role(uid, 'admin')`; non-admins get 404.

### Editable content (stored in Lovable Cloud DB, served to the public site)
A single `site_settings` table keyed by `section` (jsonb value per row). Sections:
- `hero_slides` — array of `{ image_url, video_url, title, subtitle, cta_href, order }`
- `homepage_banners` — banner1/banner2/banner3 (image, title, subtitle, cta, layout)
- `marquee` — list of strings
- `manifesto` — heading + body
- `announcement_bar` — text + link + visible flag
- `product_overrides` — `{ shopify_product_id: { badge, sale_price, compare_at_price, hidden } }`

Public components (HeroSlider, ProductBanner, etc.) read from this table via a single `useSiteSettings()` hook with React Query (5-min cache).

### Media uploads (Shopify Files)
- Edge function `shopify-file-upload` calls Shopify Admin GraphQL `stagedUploadsCreate` → uploads to S3 → `fileCreate` → returns the CDN URL.
- Admin drag-and-drop UI calls that function and writes the returned URL into `site_settings`.

### Prices (Shopify direct)
- Price editor lists products from Storefront API; "Save price" calls edge function `shopify-update-variant-price` which uses the Admin API (`shopify--update_product_variant`).
- Badges, hide flags, and "Sale" labels stay in `product_overrides` so they're instant and don't touch Shopify.

### Offers
- Manage `announcement_bar` text + create/list/delete Shopify discount codes via edge functions using the existing Admin tools.

### Admin UI
- `/admin/login`, `/admin` dashboard with tabs:
  - **Hero** — drag-reorder slides, upload, edit text
  - **Sections** — banners, marquee, manifesto, announcement
  - **Products** — search Shopify products → edit price / badge / hide
  - **Offers** — discount codes list + create form

---

## Order of delivery

1. Checkout fix + media performance pass (one round-trip — small surface, immediate win).
2. Admin auth + roles + empty `/admin` shell — you log in and confirm access works.
3. Site settings table + hero/sections editors + public components reading from DB.
4. Shopify Files upload edge function + media picker.
5. Product overrides + price editor + offers/discount editor.

Each step is shippable on its own. Confirm and I'll start with step 1.