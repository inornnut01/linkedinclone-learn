import Layout from "./components/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import NetworkPage from "./pages/NetworkPage";
import NotificationPage from "./pages/NotificationPage";
import { axiosInstance } from "./lib/axios";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          return null;
        }
        toast.error(error.response.data.message || "Something went wrong");
      }
    },
  });

  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/network"
          element={authUser ? <NetworkPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/posts"
          element={authUser ? <PostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
};

export default App;
