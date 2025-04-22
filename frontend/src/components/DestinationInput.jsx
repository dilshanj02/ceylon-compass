import { useState, useEffect } from "react";
import axios from "../utils/useAxios"; // or useAxios if you prefer

const DestinationInput = ({
  selectedDestination,
  setSelectedDestination,
  validationErrors,
  setValidationErrors,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios
      .get("/api/destinations/")
      .then((res) => {
        setDestinations(res.data); // now contains [{id, name}]
      })
      .catch((err) => {
        console.error("Failed to fetch destinations:", err);
        setDestinations([]);
      });
  }, []);

  // Used for filtering dropdown list
  const filteredDestinations = searchQuery
    ? destinations.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : destinations;

  // Get the currently selected destination’s name
  const selectedName =
    destinations.find((d) => d.id === selectedDestination)?.name || "";

  return (
    <fieldset className="relative">
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Destination
      </legend>

      <input
        type="text"
        className="input input-bordered w-full cursor-pointer rounded-full focus:outline-none"
        placeholder="Search destinations"
        value={searchQuery || selectedName}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsDropdownOpen(true);
          setValidationErrors((prev) => ({ ...prev, destination: "" }));
        }}
        onFocus={() => setIsDropdownOpen(true)}
      />

      {validationErrors.destination && (
        <p className="text-red-500 text-xs mt-1 pl-4">
          {validationErrors.destination}
        </p>
      )}

      {isDropdownOpen && filteredDestinations.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
          {filteredDestinations.map((destination) => (
            <li
              key={destination.id}
              className="p-3 text-gray-700 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSelectedDestination(destination.id); // use ID
                setSearchQuery(destination.name); // show name
                setIsDropdownOpen(false);
              }}
            >
              {destination.name}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

export default DestinationInput;
