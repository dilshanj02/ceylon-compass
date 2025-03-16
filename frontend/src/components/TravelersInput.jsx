const TravelersInput = ({ travelers, setTravelers, validationErrors }) => {
  // Function to handle traveler count change
  const handleTravelersChange = (value) => {
    if (value >= 1 && value <= 4) {
      setTravelers(value);
    }
  };

  return (
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
          className="absolute inset-y-0 left-3 flex items-center text-gray-500 hover:bg-gray-100 px-2 rounded-full transition"
          onClick={() => handleTravelersChange(travelers - 1)}
          disabled={travelers === 1}
        >
          ➖
        </button>

        {/* Increment Button (Inside Input, Right) */}
        <button
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:bg-gray-100 px-2 rounded-full transition"
          onClick={() => handleTravelersChange(travelers + 1)}
          disabled={travelers === 10}
        >
          ➕
        </button>
      </div>
    </fieldset>
  );
};

export default TravelersInput;
