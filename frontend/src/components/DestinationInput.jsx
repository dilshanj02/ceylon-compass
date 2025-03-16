import { use, useState } from "react";

const destinations = [
  "Colombo",
  "Kandy",
  "Galle",
  "Nuwara Eliya",
  "Ella",
  "Jaffna",
];

const DestinationInput = ({
  selectedDestination,
  setSelectedDestination,
  validationErrors,
  setValidationErrors,
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedDestination || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter destinations based on input
  const filteredDestinations = searchQuery
    ? destinations.filter((destination) =>
        destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <fieldset className="relative">
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Destination
      </legend>

      {/* Input Field */}
      <input
        type="text"
        className="input input-bordered w-full cursor-pointer rounded-full focus:outline-none"
        placeholder="Search destinations"
        value={searchQuery}
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

      {/* Dropdown List (Appears Below Input) */}
      {isDropdownOpen && filteredDestinations.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
          {filteredDestinations.map((destination) => (
            <li
              key={destination}
              className="p-3 text-gray-700 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSelectedDestination(destination);
                setSearchQuery(destination);
                setIsDropdownOpen(false);
              }}
            >
              {destination}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

export default DestinationInput;
