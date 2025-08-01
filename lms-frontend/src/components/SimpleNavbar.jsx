import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const SimpleNavbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand fw-bold">LMS Portal</span>
        <div className="d-flex ms-auto">
          <Link to="/dashboard" className="btn btn-light me-2">
            Dashboard
          </Link>
      
          {isAuthenticated && (
            <Link to="/courses" className="btn btn-light me-2">
              Courses
            </Link>
          )}

          {isAuthenticated ? (
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline-light">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar;
