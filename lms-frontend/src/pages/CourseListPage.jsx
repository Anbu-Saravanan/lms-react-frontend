import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/courses/all");
      setCourses(res.data);
    } catch (err) {
      setError(
        err?.response?.data || "Failed to fetch courses. Please try again."
      );
    }
  };

  const isAdminOrInstructor =
    user && (user.role === "ADMIN" || user.role === "INSTRUCTOR");

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Courses</h2>
        {isAdminOrInstructor && (
          <button
            className="btn btn-success"
            onClick={() => navigate("/courses/create")}
          >
            + Create Course
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {courses.length === 0 ? (
        <div className="alert alert-info">No courses available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Approve Status</th>
                <th>Instructor</th>
                <th>Actions</th>
                <th>View Lesson</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.approved ? "Approved" : "Pending"}</td>
                  <td>
                    {course.instructorName ||
                      course.instructor?.username ||
                      "-"}
                  </td>
                  <td>
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      View
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/courses/${course.id}/lessons`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Lessons
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
