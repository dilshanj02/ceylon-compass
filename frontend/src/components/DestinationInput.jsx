import { useState } from "react";

const destinations = [
  "Colombo",
  "Kandy",
  "Galle",
  "Ella",
  "Sigiriya",
  "Jaffna",
  "Mirissa",
  "Trincomalee",
];

const DestinationInput = ({
  searchQuery,
  setSearchQuery,
  setSelectedDestination,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter destinations based on input
  const filteredDestinations = searchQuery
    ? destinations.filter((place) =>
        place.toLowerCase().includes(searchQuery.toLowerCase())
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
        }}
        onFocus={() => setIsDropdownOpen(true)}
      />

      {/* Dropdown List (Appears Below Input) */}
      {isDropdownOpen && filteredDestinations.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
          {filteredDestinations.map((place) => (
            <li
              key={place}
              className="p-3 text-gray-700 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSelectedDestination(place);
                setSearchQuery(place);
                setIsDropdownOpen(false);
              }}
            >
              {place}
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

export default DestinationInput;
