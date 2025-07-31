import { useAuth } from "../../data/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user} = useAuth();

  if (!user ) {
    return <Navigate to="/login"/>;
  }

  return children;
};

export default ProtectedRoute;
