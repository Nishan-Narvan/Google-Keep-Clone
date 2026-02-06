import { Navigate } from "react-router-dom";
import { getAuthToken } from "../utils/api";

export default function ProtectedRoute({ children }) {
  const token = getAuthToken();
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists, render the component
  return children;
}
