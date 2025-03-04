import { useState } from "react";

export default function TravelersBudget() {
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState("");

  // Function to handle traveler count change
  const handleTravelersChange = (value) => {
    if (value >= 1 && value <= 10) {
      setTravelers(value);
    }
  };

  return (
    <>
      {/* Travelers Field with Increment & Decrement Buttons */}
      <fieldset className="relative">
        <legend className="text-sm font-semibold text-gray-600 pl-4">
          Travelers
        </legend>
        <div className="relative w-full">
          {/* Number Input with Padding for Icons */}
          <input
            type="text"
            className="input input-bordered w-full text-center rounded-full focus:outline-none px-10"
            value={travelers}
            readOnly
          />

          {/* Decrement Button (Inside Input, Left) */}
          <button
            className="absolute inset-y-0 left-3 flex items-center text-gray-500 px-2 rounded-full"
            onClick={() => handleTravelersChange(travelers - 1)}
            disabled={travelers === 1}
          >
            ➖
          </button>

          {/* Increment Button (Inside Input, Right) */}
          <button
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 px-2 rounded-full"
            onClick={() => handleTravelersChange(travelers + 1)}
            disabled={travelers === 10}
          >
            ➕
          </button>
        </div>
      </fieldset>

      {/* Budget Field with Currency Icon */}
      <fieldset className="relative">
        <legend className="text-sm font-semibold text-gray-600 pl-4">
          Budget
        </legend>
        <div className="relative">
          {/* Budget Input */}
          <input
            type="number"
            className="input input-bordered w-full rounded-full focus:outline-none"
            placeholder="Enter budget"
            value={budget}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              setBudget(value);
            }}
            min="0"
            step="1" // Ensures whole numbers only
          />
        </div>
      </fieldset>
    </>
  );
}
