import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import PlanPage from "./pages/PlanPage";

const router = createBrowserRouter(
  createRoutesFromElements(
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
        path="/community"
        element={<h1 className="text-4xl font-bold p-6">Community</h1>}
      />
      <Route
        path="/login"
        element={<h1 className="text-4xl font-bold p-6">Login</h1>}
      />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
