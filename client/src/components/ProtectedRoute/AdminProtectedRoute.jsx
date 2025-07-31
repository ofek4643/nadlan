import { Navigate } from "react-router-dom";
import { useAuth } from "../../data/AuthContext.jsx";

const AdminProtectedRoute = ({ children }) => {
  const { user , isAdmin} = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/not-authorized" replace />;

  return children;
};

export default AdminProtectedRoute;
