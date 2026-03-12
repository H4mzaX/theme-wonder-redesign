import { useState, useEffect } from 'react';
import { fetchProducts } from '@/lib/fetchProducts';
import Navbar from '../components/Navbar';
import AnnouncementBar from '../components/AnnouncementBar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg">Loading products from Shopify...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">All Products</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(({ node }) => (
            <div key={node.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {node.images.edges[0] && (
                <div className="aspect-square p-6">
                  <img
                    src={node.images.edges[0].node.url}
                    alt={node.images.edges[0].node.altText || node.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{node.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {node.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">
                    ₹{node.priceRange.minVariantPrice.amount}
                  </p>
                  {node.availableForSale ? (
                    <span className="text-xs text-green-600">In Stock</span>
                  ) : (
                    <span className="text-xs text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;
