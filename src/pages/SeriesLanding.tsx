import { useParams, Navigate } from "react-router-dom";
import { seriesData, deviceSeries, type SeriesSlug } from "@/data/products";

const SeriesLanding = () => {
  const { seriesSlug } = useParams<{ seriesSlug: string }>();
  const series = seriesSlug ? seriesData[seriesSlug as SeriesSlug] : null;

  if (!series || !seriesSlug) return <Navigate to="/" replace />;

  // Redirect to the first device group's first model product page
  const firstGroup = deviceSeries[0];
  const firstModel = firstGroup?.models[0];
  
  if (firstGroup && firstModel) {
    return <Navigate to={`/${seriesSlug}/${firstGroup.slug}?model=${firstModel.slug}`} replace />;
  }

  return <Navigate to="/" replace />;
};

export default SeriesLanding;
