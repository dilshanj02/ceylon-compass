import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PlanPage from "./pages/PlanPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import TripsPage from "./pages/TripsPage";
import TripPage from "./pages/TripPage";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/plan" element={<PlanPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/:id" element={<TripPage />} />
            </Route>
            <Route
              path="/community"
              element={<h1 className="text-4xl font-bold p-6">Community</h1>}
            />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
