import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../store/auth-context";

function ProtectedRoute({ children, allowedRoles }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles) {
    const decoded = jwtDecode(token);
    const rol = decoded?.sub.split("#")[2];

    if (!allowedRoles.includes(rol)) {
      return <Navigate to="/no-autorizado" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
