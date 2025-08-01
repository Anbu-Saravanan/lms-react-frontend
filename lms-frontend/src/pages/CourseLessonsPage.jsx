import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../auth/AuthContext";
import { useContext } from "react";
import AddMediaForm from "./AddMediaForm";

const CourseLessonsPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const isAdminOrInstructor =
    user && (user.role === "ADMIN" || user.role === "INSTRUCTOR");

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      // Fetch lessons
      const res = await api.get(`/api/courses/${courseId}/lessons`);
      setLessons(res.data);

      // Optionally: fetch course title for display
      const courseRes = await api.get(`/api/courses/getById/${courseId}`);
      setCourseTitle(courseRes.data.title);

      setLoading(false);
    } catch (err) {
      setError("Failed to load lessons.");
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-4">Loading lessons...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  console.log("LESSONS:", lessons)
  return (
    <div className="container mt-5" style={{ maxWidth: 900 }}>
      <h2>Course: {courseTitle}</h2>
      <h4>Lessons</h4>

      {isAdminOrInstructor && (
        
        <Link
          to={`/courses/${courseId}/lessons/add`}
          className="btn btn-success mb-3"
        >
          + Add Lesson
        </Link>
      )}

      {lessons.length === 0 ? (
        <div className="alert alert-info">No lessons yet for this course.</div>
      ) : (
        <div className="accordion" id="lessonsAccordion">
          {lessons.map((lesson, idx) => (
            <div className="accordion-item" key={lesson.id}>
              <h2 className="accordion-header" id={`heading${lesson.id}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${lesson.id}`}
                  aria-expanded="false"
                  aria-controls={`collapse${lesson.id}`}
                >
                  {lesson.title}
                </button>
              </h2>
              <div
                id={`collapse${lesson.id}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${lesson.id}`}
                data-bs-parent="#lessonsAccordion"
              >
                <div className="accordion-body">
                  <div>
                    <strong>Content:</strong>
                    <div>{lesson.content}</div>
                  </div>
                  <div>
                    <strong>Media:</strong>
                    {lesson.mediaList && lesson.mediaList.length > 0 ? (
                      <ul>
                        {lesson.mediaList.map((media) => (
                          <li key={media.id}>
                            {media.type === "VIDEO" ? (
                              <video width="400" controls>
                                <source src={media.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <a
                                href={media.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {media.type}: {media.url}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span> No media files.</span>
                    )}
                  </div>
                  {isAdminOrInstructor && (
                    <AddMediaForm
                      lessonId={lesson.id}
                      onSuccess={fetchLessons}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseLessonsPage;
