import { Navigate, useLocation } from "react-router-dom";

export default function Authenticated({ children, user, loading }) {
  const location = useLocation();

  if (!user && !loading)
    return <Navigate to="/sign-in" state={{ from: location }} />;

  return children;
}
