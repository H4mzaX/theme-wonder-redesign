import { useParams, Navigate } from "react-router-dom";
import { getProductUrlById } from "@/data/products";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const canonicalUrl = id ? getProductUrlById(id) : null;

  if (canonicalUrl) {
    return <Navigate to={canonicalUrl} replace />;
  }

  return <Navigate to="/" replace />;
};

export default ProductDetail;
