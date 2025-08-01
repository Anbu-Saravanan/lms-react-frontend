import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get("/api/courses/enrollments/my"); // use your endpoint!
        setEnrollments(res.data);
      } catch (err) {
        setError("Could not load your enrollments.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: 700 }}>
      <h2>My Enrolled Courses</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Instructor</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enr) => (
            <tr key={enr.id}>
              <td>{enr.courseTitle}</td>
              <td>{enr.instructorName}</td>
              <td>Enrolled</td>
              <td>
                <Link
                  to={`/courses/${enr.courseId}/lessons`}
                  className="btn btn-info btn-sm"
                >
                  View Lessons
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyEnrollmentsPage;
