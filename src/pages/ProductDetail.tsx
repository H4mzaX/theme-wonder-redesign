import { useParams, Navigate } from "react-router-dom";
import { allProducts, getProductUrl } from "@/data/products";

/**
 * Legacy redirect: /product/:id → /:seriesSlug/:deviceGroupSlug
 * Keeps old URLs working while consolidating to a single canonical URL pattern.
 */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find((p) => p.id === id);

  if (product) {
    return <Navigate to={getProductUrl(product)} replace />;
  }

  return <Navigate to="/404" replace />;
};

export default ProductDetail;
