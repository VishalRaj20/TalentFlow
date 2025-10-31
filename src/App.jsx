import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "./components/ui/Spinner";
import PageLayout from "./components/PageLayout";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

const HomePage = lazy(() => import("./pages/HomePage"));
const JobsPage = lazy(() => import("./pages/JobsPage"));
const JobDetailPage = lazy(() => import("./pages/JobDetailPage"));
const CandidatesPage = lazy(() => import("./pages/CandidatesPage"));
const CandidatePage = lazy(() => import("./pages/CandidatePage"));
const AssessmentsPage = lazy(() => import("./pages/AssessmentsPage"));
const AssessmentEditorPage = lazy(() => import("./pages/AssessmentEditorPage"));

function MainLayout() {
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-800 dark:border-b dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold text-sky-600 hover:text-sky-700 transition">
            TalentFlow
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="space-x-4 font-medium text-lg text-gray-700 dark:text-gray-300">
              <Link to="/jobs" className="hover:text-sky-600 transition">Jobs</Link>
              <Link to="/candidates" className="hover:text-sky-600 transition">Candidates</Link>
              <Link to="/assessments" className="hover:text-sky-600 transition">Assessments</Link>
            </nav>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <Suspense fallback={<div className="p-8 text-center"><Spinner /> Loading...</div>}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
              <Route path="/jobs" element={<PageLayout><JobsPage /></PageLayout>} />
              <Route path="/jobs/:jobId" element={<PageLayout><JobDetailPage /></PageLayout>} />
              <Route path="/candidates" element={<PageLayout><CandidatesPage /></PageLayout>} />
              <Route path="/candidates/:id" element={<PageLayout><CandidatePage /></PageLayout>} />
              <Route path="/assessments" element={<PageLayout><AssessmentsPage /></PageLayout>} />
              <Route path="/assessments/:jobId" element={<PageLayout><AssessmentEditorPage /></PageLayout>} />
              <Route
                path="*"
                element={
                  <PageLayout>
                    <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                      Page not found — <Link to="/" className="text-sky-600 hover:underline">Go home</Link>
                    </div>
                  </PageLayout>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4 mt-auto dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} TalentFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}