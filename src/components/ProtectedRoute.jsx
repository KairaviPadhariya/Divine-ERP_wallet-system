import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
