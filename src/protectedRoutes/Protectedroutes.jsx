import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/signin" />;
}
export default ProtectedRoutes;
