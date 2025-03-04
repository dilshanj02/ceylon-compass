import { useState } from "react";

const locations = [
  "Colombo",
  "Kandy",
  "Galle",
  "Ella",
  "Sigiriya",
  "Jaffna",
  "Mirissa",
  "Trincomalee",
];

export default function DestinationInput({
  searchQuery,
  setSearchQuery,
  setSelectedLocation,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter locations based on input
  const filteredLocations = searchQuery
    ? locations.filter((place) =>
        place.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <fieldset className="relative">
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Where
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
      {isDropdownOpen && filteredLocations.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
          {filteredLocations.map((place) => (
            <li
              key={place}
              className="p-3 text-gray-700 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSelectedLocation(place);
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
}
