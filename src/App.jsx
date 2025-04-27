import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage";
import AddNewCourse from "./pages/instructor/add-new-course";
import { InstructorProvider } from "./context/instructor-context/InstructorContext";

function App() {
  return (
    <AuthProvider>
      <InstructorProvider>

        <BrowserRouter>
          <Navbar />
          <Toaster richColors position="bottom-right" />
          <div className="h-20 w-full"></div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route path="/create-new-course" element={<AddNewCourse />} />
            <Route path="/instructor/edit-course/:courseId" element={<AddNewCourse />} />
          </Routes>
        </BrowserRouter>
      </InstructorProvider>
    </AuthProvider>
  );
}

export default App;
