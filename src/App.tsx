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
import AddCourseForm from "./pages/courses";

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
                <div>Dashboard</div>
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
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
