import React, { useState } from "react";
import api from "../api/api";

const AddMediaForm = ({ lessonId, onSuccess }) => {
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("VIDEO");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setSubmitting(true);

    try {
      await api.post(`/api/lessons/${lessonId}/media`, {
        url: mediaUrl,
        type: mediaType,
      });
      setMsg("Media added!");
      setMediaUrl("");
      setMediaType("VIDEO");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to add media."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3 border rounded p-3">
      <div className="mb-2 fw-bold">Add Media</div>
      {error && <div className="alert alert-danger py-1">{error}</div>}
      {msg && <div className="alert alert-success py-1">{msg}</div>}
      <div className="row g-2 align-items-center">
        <div className="col">
          <input
            type="url"
            className="form-control"
            placeholder="Media URL (e.g. https://...)"
            value={mediaUrl}
            onChange={e => setMediaUrl(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            value={mediaType}
            onChange={e => setMediaType(e.target.value)}
            required
            disabled={submitting}
          >
            <option value="VIDEO">Video</option>
            <option value="IMAGE">Image</option>
            <option value="PDF">PDF</option>
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-success" type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Media"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddMediaForm;
