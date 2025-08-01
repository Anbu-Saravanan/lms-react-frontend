import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";
import SimpleNavbar from "./components/SimpleNavbar";
import CourseListPage from "./pages/CourseListPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import EditCoursePage from "./pages/EditCoursePage";
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage";
import CourseLessonsPage from "./pages/CourseLessonsPage";
import AddLessonPage from "./pages/AddLessonPage";

function App() {
  return (
    <BrowserRouter>
      <SimpleNavbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage/>}/>

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <PrivateRoute>
              <CourseDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses/create"
          element={
            <PrivateRoute>
              <CreateCoursePage />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <CourseListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses/edit/:id"
          element={
            <PrivateRoute>
              <EditCoursePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <PrivateRoute>
              <MyEnrollmentsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses/:courseId/lessons"
          element={
            <PrivateRoute>
              <CourseLessonsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses/:courseId/lessons/add"
          element={
            <PrivateRoute>
              <AddLessonPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
