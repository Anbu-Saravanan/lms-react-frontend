import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../auth/AuthContext";

const LoginPage = () => {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/auth/login", form);
      const { token, refreshToken, email, role } = res.data;
      const user = { email, role };
      
      login({ accessToken: token, refreshToken, user });
       setLoginSuccess(true);
      console.log("User to save in context:", user); 
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data || "Login failed. Please check your credentials."
      );
    }
  };
  useEffect(() => {
    if (loginSuccess) { 
        navigate("/dashboard");
    }
  }, [loginSuccess, navigate]);

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
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
            autoComplete="current-password"
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>
      <div className="mt-3 text-center">
        <a href="/register">Don't have an account? Register</a>
      </div>
    </div>
  );
};

export default LoginPage;
