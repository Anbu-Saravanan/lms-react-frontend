import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  console.log("User from Dashboard:", user);


  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <div className="card p-4 shadow rounded-3">
        <h2 className="mb-4">Welcome to the Dashboard!</h2>
        {user ? (
          <div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button className="btn btn-danger mt-3" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <p>User not found in context.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
