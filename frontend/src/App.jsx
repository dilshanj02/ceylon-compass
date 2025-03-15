import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PlanPage from "./pages/PlanPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={<h1 className="text-4xl font-bold p-6">Home Page</h1>}
            />
            <Route path="/plan" element={<PlanPage />} />
            <Route
              path="/trips"
              element={<h1 className="text-4xl font-bold p-6">Trips</h1>}
            />
            <Route
              path="/trips/:id"
              element={<h1 className="text-4xl font-bold p-6">Trip Summary</h1>}
            />
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
