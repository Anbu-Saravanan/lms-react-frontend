import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const AddLessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    orderNumber: 1,
    mediaList: [{ url: "", type: "" }],
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (idx, e) => {
    const updatedMedia = [...form.mediaList];
    updatedMedia[idx][e.target.name] = e.target.value;
    setForm({ ...form, mediaList: updatedMedia });
  };

  const addMediaField = () => {
    setForm({
      ...form,
      mediaList: [...form.mediaList, { url: "", type: "" }],
    });
  };

  const removeMediaField = (idx) => {
    const updatedMedia = form.mediaList.filter((_, i) => i !== idx);
    setForm({ ...form, mediaList: updatedMedia });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      // Filter out empty media
      const cleanedMedia = form.mediaList.filter(
        (m) => m.url.trim() !== "" && m.type.trim() !== ""
      );
      const payload = {
        title: form.title,
        content: form.content,
        orderNumber: Number(form.orderNumber),
        mediaList: cleanedMedia,
      };
      await api.post(`/api/courses/${courseId}/lessons/create`, payload);
      setMsg("Lesson created successfully!");
      setTimeout(() => navigate(`/courses/${courseId}/lessons`), 1000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Failed to add lesson."
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 700 }}>
      <h2>Add Lesson</h2>
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
          <label>Content</label>
          <textarea
            className="form-control"
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        <div className="mb-3">
          <label>Order Number</label>
          <input
            className="form-control"
            name="orderNumber"
            type="number"
            value={form.orderNumber}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        <label>Media Files (optional)</label>
        {form.mediaList.map((media, idx) => (
          <div key={idx} className="row g-2 mb-2">
            <div className="col">
              <input
                className="form-control"
                name="url"
                placeholder="Media URL"
                value={media.url}
                onChange={(e) => handleMediaChange(idx, e)}
              />
            </div>
            <div className="col">
              <select
                className="form-select"
                name="type"
                value={media.type}
                onChange={(e) => handleMediaChange(idx, e)}
              >
                <option value="">Select Type</option>
                <option value="VIDEO">Video</option>
                <option value="IMAGE">Image</option>
                {/* Add more types if needed */}
              </select>
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeMediaField(idx)}
                disabled={form.mediaList.length === 1}
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary btn-sm mb-3"
          onClick={addMediaField}
        >
          + Add Media
        </button>

        <div>
          <button type="submit" className="btn btn-success">
            Create Lesson
          </button>
          <button
            type="button"
            className="btn btn-link ms-2"
            onClick={() => navigate(`/courses/${courseId}/lessons`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLessonPage;
