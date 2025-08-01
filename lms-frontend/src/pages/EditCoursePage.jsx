import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // Load course details for editing
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/courses/getById/${id}`);
        setForm({
          title: res.data.title,
          description: res.data.description,
        });
      } catch (err) {
        setError("Could not load course details.");
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await api.put(`/api/courses/update/${id}`, form);
      setMsg("Course updated successfully!");
      setTimeout(() => navigate(`/courses/${id}`), 1000);
    } catch (err) {
      setError(err?.response?.data || "Failed to update course.");
    }
  };

  if (!(user && (user.role === "ADMIN" || user.role === "INSTRUCTOR"))) {
    return <div className="alert alert-danger">Access Denied</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <div className="card p-4 shadow rounded-3">
        <h2 className="mb-4">Edit Course</h2>
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
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;
