export default function CheckInOut() {
  return (
    <>
      {/* Check-in Field */}
      <fieldset className="relative">
        <legend className="text-sm font-semibold text-gray-600 pl-4">
          Check-in
        </legend>
        <div className="relative">
          {/* Calendar Icon */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
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
          />
        </div>
      </fieldset>

      {/* Check-out Field */}
      <fieldset className="relative">
        <legend className="text-sm font-semibold text-gray-600 pl-4">
          Check-out
        </legend>
        <div className="relative">
          {/* Calendar Icon */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
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
          />
        </div>
      </fieldset>
    </>
  );
}
