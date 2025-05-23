import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CurrencyContext from "../context/CurrencyContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get current path
  const { user, logout } = useContext(AuthContext);
  const { currency, setCurrency } = useContext(CurrencyContext);
  const navigate = useNavigate();

  const handleSignin = () => {
    if (user) {
      logout();
    } else {
      navigate("/signin");
    }
  };

  return (
    <nav className="bg-white fixed w-full z-20 border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">
            Ceylon Compass
          </span>
        </Link>

        {/* Right-side buttons */}
        <div className="flex md:order-2 space-x-3 md:space-x-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="ml-4 border-gray-300 text-sm rounded-md"
          >
            <option value="LKR">LKR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <button
            onClick={handleSignin}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 
            font-medium rounded-full text-sm px-5 py-2.5 me-2 border-gray-700"
          >
            {user ? "Sign out" : "Sign in"}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg 
            md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`items-center justify-between ${
            isMenuOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul
            className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 
            md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white"
          >
            {[
              { name: "Home", path: "/" },
              { name: "Plan", path: "/plan" },
              { name: "Trips", path: "/trips" },
              { name: "Community", path: "/community" },
              { name: "About Us", path: "/about" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block py-2 px-3 rounded-sm transition ${
                    location.pathname === item.path
                      ? "text-blue-700 font-semibold" // Active link color
                      : "text-gray-900 hover:text-blue-700"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
