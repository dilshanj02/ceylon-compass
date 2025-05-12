import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PlanPage from "./pages/PlanPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import TripsPage from "./pages/TripsPage";
import TripPage from "./pages/TripPage";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import CommunityPage from "./pages/CommunityPage";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import PrivateRoute from "./utils/PrivateRoute";

import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/plan" element={<PlanPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/trips/:id" element={<TripPage />} />
              </Route>

              <Route path="/community" element={<CommunityPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}
