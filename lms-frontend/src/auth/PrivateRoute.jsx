import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  console.log("PrivateRoute isAuthenticated:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;




};


export default PrivateRoute;
