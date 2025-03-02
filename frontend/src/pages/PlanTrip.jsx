const PlanTrip = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
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

        {/* Second Row - Dates & Guests (8 Columns Wide, Centered) */}
        <div className="col-span-8 col-start-4 flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
          {/* Check-in Input */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-black">Check-in</p>
            <input type="date" className="w-full focus:outline-none text-sm" />
          </div>
          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-300 h-6"></div>
          {/* Check-out Input */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-black">Check-out</p>
            <input type="date" className="w-full focus:outline-none text-sm" />
          </div>
        </div>

        {/* Third Row - Budget & Submit (8 Columns Wide, Centered) */}
        <div className="col-span-8 col-start-2 flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
          {/* Guests Selection */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-black">Who</p>
            <select
              className="w-full focus:outline-none text-sm text-gray-700 appearance-none pr-6"
              defaultValue=""
            >
              <option value="" disabled hidden>
                Add guests
              </option>
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4+ Guests</option>
            </select>
          </div>
          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-300 h-6"></div>
          {/* Budget Selection */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-black">How much</p>
            <select
              className="w-full focus:outline-none text-sm text-gray-700 appearance-none pr-6"
              defaultValue=""
            >
              <option value="" disabled hidden>
                Add budget
              </option>
              <option>$100 - $500</option>
              <option>$500 - $1000</option>
              <option>$1000 - $2000</option>
              <option>$2000+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
