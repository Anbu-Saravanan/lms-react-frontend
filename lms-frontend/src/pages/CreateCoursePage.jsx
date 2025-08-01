import React, { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateCoursePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // Only allow ADMIN or INSTRUCTOR
  if (!(user && (user.role === "ADMIN" || user.role === "INSTRUCTOR"))) {
    return <div className="alert alert-danger">Access Denied</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      // You may need to send instructorId: user.id (if required by backend)
      const payload = {
        ...form,
        instructorId: user.id, // Only if your backend expects it!
        // Or your backend might assign instructor from the logged-in user (token)
      };
      await api.post("/api/courses/create", payload);
      setMsg("Course created successfully!");
      setTimeout(() => navigate("/courses"), 1000);
    } catch (err) {
      setError(
        err?.response?.data || "Failed to create course. Please try again."
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <div className="card p-4 shadow rounded-3">
        <h2 className="mb-4">Create Course</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {msg && <div className="alert alert-success">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Title</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          <button className="btn btn-success w-100" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
