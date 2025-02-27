const PlanTrip = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-red-50">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-black mb-8">
        Plan a Trip
      </h1>
      <div className="grid grid-cols-12 gap-4 justify-center">
        {/* First Row - Destination & Theme (8 Columns Wide, Centered) */}
        <div className="col-span-8 col-start-2 flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
          {/* Destination Input */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-black">Where</p>
            <input
              type="text"
              placeholder="Search destinations"
              className="w-full focus:outline-none text-sm"
            />
          </div>
          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-300 h-6"></div>
          {/* Theme Selection (Styled to Match Input) */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-black">What</p>
            <select
              className="w-full focus:outline-none text-sm text-gray-700 placeholder-gray-400 appearance-none pr-6"
              defaultValue=""
            >
              <option value="" disabled hidden className="text-gray-400">
                Select a theme
              </option>
              <option>Adventure</option>
              <option>Relaxation</option>
              <option>Cultural</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
