import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "STUDENT", // default role
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      // Your backend expects: username, email, password, role
      const res = await api.post("/api/auth/register", form);
      setMsg(res.data || "Registered successfully! Please login.");
      setTimeout(() => navigate("/login"), 1500); // Redirect after success
    } catch (err) {
      setError(
        err?.response?.data || "Registration failed. Try a different email/username."
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input
            className="form-control"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button className="btn btn-success w-100" type="submit">
          Register
        </button>
      </form>
      <div className="mt-3 text-center">
        <a href="/login">Already have an account? Login</a>
      </div>
    </div>
  );
};

export default RegisterPage;
