import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../auth/AuthContext";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/api/courses/getById/${id}`);
      setCourse(res.data);
    } catch (err) {
      setError(
        err?.response?.data || "Failed to fetch course. Please try again."
      );
    }
  };

  const handleApprove = async () => {
    try {
      const res = await api.patch(`/api/courses/${id}/approve`);
      setCourse(res.data);
      setMsg("Course approved!");
    } catch (err) {
      setError(err?.response?.data || "Failed to approve course.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/api/courses/delete/${id}`);
      navigate("/courses");
    } catch (err) {
      setError(err?.response?.data || "Failed to delete course.");
    }
  };

  const handleEdit = () => {
    navigate(`/courses/edit/${id}`);
  };

  const handleEnroll = async () => {
    setError("");
    setMsg("");
    try {
      await api.post(`/api/courses/${course.id}/enrollments/create`, {});
      setEnrolled(true);
      setMsg("You are enrolled in this course!");
    } catch (err) {
      setError(err?.response?.data || "Enrollment failed.");
    }
  };

  // Role checks
  const isAdmin = user && user.role === "ADMIN";
  const isInstructor = user && user.role === "INSTRUCTOR";

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <div className="card shadow p-4 rounded-3">
        {/* Loading and Error Section */}
        {!course ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Course Main Info */}
            <h2 className="mb-3">{course.title}</h2>
            <p>{course.description}</p>

            {/* Student Enroll */}
            {user?.role === "STUDENT" && !enrolled && (
              <button className="btn btn-success mb-3" onClick={handleEnroll}>
                Enroll
              </button>
            )}
            {enrolled && <div className="alert alert-success">{msg}</div>}

            {/* Error/Msg for All */}
            {error && <div className="alert alert-danger">{error}</div>}
            {msg && user?.role !== "STUDENT" && (
              <div className="alert alert-success">{msg}</div>
            )}

            {/* Course Details Table */}
            <h4 className="mb-3 mt-3">Course Details</h4>
            <p>
              <strong>Instructor:</strong> {course.instructorName || "-"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {course.approved ? (
                <span className="badge bg-success">Approved</span>
              ) : (
                <span className="badge bg-warning text-dark">Pending</span>
              )}
            </p>

            {/* Action Buttons */}
            {(isAdmin || isInstructor) && (
              <div className="mt-4">
                <button className="btn btn-primary me-2" onClick={handleEdit}>
                  Edit
                </button>
                <button className="btn btn-danger me-2" onClick={handleDelete}>
                  Delete
                </button>
                {isAdmin && !course.approved && (
                  <button className="btn btn-success" onClick={handleApprove}>
                    Approve
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
