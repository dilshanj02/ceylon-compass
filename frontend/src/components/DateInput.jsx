const DateInput = ({
  label,
  date,
  setDate,
  minDate,
  validationErrors,
  setValidationErrors,
}) => {
  return (
    <fieldset className="relative">
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        {label}
      </legend>
      <div className="relative">
        {/* Calendar icon */}
        <div
          className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
          onMouseDown={(e) => e.preventDefault()}
        >
          <svg
            className="w-5 h-5 text-gray-500"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6 2a1 1 0 0 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1.5A1.5 1.5 0 0 1 17 4.5V6H3V4.5A1.5 1.5 0 0 1 4.5 3H6V2Z" />
            <path
              fillRule="evenodd"
              d="M3 8V7h14v1H3Zm0 1v8.5A1.5 1.5 0 0 0 4.5 19h11A1.5 1.5 0 0 0 17 17.5V9H3Zm5 2a1 1 0 1 1 0 2h4a1 1 0 1 1 0-2H8Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="date"
          className="input input-bordered w-full rounded-full focus:outline-none"
          value={date}
          min={minDate} // Restrict past dates
          onChange={(e) => {
            setDate(e.target.value);
            setValidationErrors((prev) => {
              const updatedErrors = { ...prev };

              if (label === "Check-in") {
                delete updatedErrors.checkIn;
              } else if (label === "Check-out") {
                delete updatedErrors.checkOut;
              }
              return updatedErrors;
            });
          }}
        />
        {label == "Check-in" && validationErrors.checkIn && (
          <p className="text-red-500 text-xs mt-1 pl-4">
            {validationErrors.checkIn}
          </p>
        )}
        {label == "Check-out" && validationErrors.checkOut && (
          <p className="text-red-500 text-xs mt-1 pl-4">
            {validationErrors.checkOut}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export default DateInput;
