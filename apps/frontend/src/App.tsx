import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/auth";
import AuthGuard from "./components/auth-guard";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import LandingPage from "./pages/landing-page";
import Visualizer from "./pages/visualizer";
import Layout from "./components/layout";
import { UserCard } from "./components/user-card";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/home"
              element={
                <AuthGuard>
                  <Layout>
                    <HomePage />
                  </Layout>
                </AuthGuard>
              }
            />
            <Route
              path="/visualize"
              element={
                <AuthGuard>
                  <Layout>
                    <Visualizer />
                  </Layout>
                </AuthGuard>
              }
            />
            <Route
              path="/user"
              element={
                <AuthGuard>
                  <Layout>
                    <UserCard />
                  </Layout>
                </AuthGuard>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
