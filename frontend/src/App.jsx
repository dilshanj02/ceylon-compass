import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-20 p-6">
        <Routes>
          <Route
            path="/"
            element={<h1 className="text-4xl font-bold p-6">Home Page</h1>}
          />
          <Route
            path="/plan"
            element={<h1 className="text-4xl font-bold p-6">Plan a Trip</h1>}
          />
          <Route
            path="/trips"
            element={<h1 className="text-4xl font-bold p-6">Trips</h1>}
          />
          <Route
            path="/community"
            element={<h1 className="text-4xl font-bold p-6">Community</h1>}
          />
          <Route
            path="/login"
            element={<h1 className="text-4xl font-bold p-6">Login Page</h1>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
