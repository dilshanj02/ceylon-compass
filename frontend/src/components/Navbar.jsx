import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 w-full px-6 md:px-8 py-4 transition-all duration-300 ${
        scrolled ? "border-b border-gray-300" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 items-center">
        {/* Logo */}
        <Link to="/" className="col-span-3 text-3xl font-bold text-gray-800">
          Ceylon Compass
        </Link>

        {/* Navigation Links */}
        <nav className="col-span-6 flex justify-center space-x-6">
          <Link to="/" className="hover:text-blue-500 transition">
            Home
          </Link>
          <Link to="/plan" className="hover:text-blue-500 transition">
            Plan a Trip
          </Link>
          <Link to="/trips" className="hover:text-blue-500 transition">
            Trips
          </Link>
          <Link to="/community" className="hover:text-blue-500 transition">
            Community
          </Link>
        </nav>

        {/* Sign-in Button */}
        <div className="col-span-3 text-right">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign-in
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
