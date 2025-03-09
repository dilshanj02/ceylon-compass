import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Main content container */}
        <main className="flex-grow mt-20 p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
