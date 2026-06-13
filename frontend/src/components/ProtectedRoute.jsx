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
    console.log(decoded)
    const rol = decoded?.sub.split("#")[2].split(",")[0]
    console.log(rol)

    if (!allowedRoles.includes(rol)) {
      return <Navigate to="/no-autorizado" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
