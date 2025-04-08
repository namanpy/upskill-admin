import "./App.css";
import { ThemeProviderWrapper } from "./context/theme.context";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/auth.context";
import AddCourseForm from "./pages/courses/course-add";
import Dashboard from "./pages/dashboard";
import CategoryAdd from "./pages/category/category-add";
import CourseList from "./pages/courses/course-list";
import CourseEditForm from "./pages/courses/course-edit";
import CategoryList from "./pages/category/category-list";
import CategoryEdit from "./pages/category/category-edit";
import BatchesList from "./pages/batches/batches-list";
import BatchAdd from "./pages/batches/batches-add";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import BannerList from "./pages/banners/banner-list";
import BannerAdd from "./pages/banners/banner-add";
import BatchEdit from "./pages/batches/batches-edit";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <ThemeProviderWrapper>
              <AppContent />
            </ThemeProviderWrapper>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// New component to access auth context
const AppContent = () => {
  const { user } = useAuth();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <>
      {user && <Header username="admin" />}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {" "}
        <div className="content-wrapper">
          {user && <Sidebar />}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Home Page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/add"
              element={
                <ProtectedRoute>
                  <AddCourseForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/list"
              element={
                <ProtectedRoute>
                  <CourseList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/edit/:courseCode"
              element={
                <ProtectedRoute>
                  <CourseEditForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/category/add"
              element={
                <ProtectedRoute>
                  <CategoryAdd />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>404 Not Found</div>} />

            <Route
              path="/category/list"
              element={
                <ProtectedRoute>
                  <CategoryList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/category/edit/:categoryCode"
              element={
                <ProtectedRoute>
                  <CategoryEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/list"
              element={
                <ProtectedRoute>
                  <BatchesList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/add"
              element={
                <ProtectedRoute>
                  <BatchAdd />
                </ProtectedRoute>
              }
            />

            <Route
              path="/batches/edit/:id"
              element={
                <ProtectedRoute>
                  <BatchEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/banners/add"
              element={
                <ProtectedRoute>
                  <BannerAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/banners/list"
              element={
                <ProtectedRoute>
                  <BannerList />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default App;
