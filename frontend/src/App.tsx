import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ProtectedRoute } from './components';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { WhitelistPage } from './pages/WhitelistPage';
import { NonFollowersPage } from './pages/NonFollowersPage';
import { ExFollowersPage } from './pages/ExFollowersPage';
import LoginPage from './pages/LoginPage';

// Placeholder pages (to be implemented)

const StatsPage = () => (
  <div>
    <h1 className="text-3xl font-bold">Statistics</h1>
    <p className="mt-2 text-gray-600">Coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Layout>
                  <UploadPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/whitelist"
            element={
              <ProtectedRoute>
                <Layout>
                  <WhitelistPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/non-followers"
            element={
              <ProtectedRoute>
                <Layout>
                  <NonFollowersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ex-followers"
            element={
              <ProtectedRoute>
                <Layout>
                  <ExFollowersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <Layout>
                  <StatsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
