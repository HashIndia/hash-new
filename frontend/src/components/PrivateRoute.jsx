import { Navigate } from "react-router-dom";
import useUserStore from "../utils/useUserStore";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
