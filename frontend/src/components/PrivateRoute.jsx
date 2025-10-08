import { Navigate } from "react-router-dom";
import useUserStore from "../utils/useUserStore";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useUserStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
