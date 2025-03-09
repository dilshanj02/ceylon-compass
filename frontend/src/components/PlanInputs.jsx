import { useState } from "react";
import DestinationInput from "./DestinationInput";
import ThemeInput from "./ThemeInput";
import DateInput from "./DateInput";
import TravelersInput from "./TravelersInput";
import BudgetInput from "./BudgetInput";

const PlanInputs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const [theme, setTheme] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [travelers, setTravelers] = useState(1);

  const [budget, setBudget] = useState();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Daisyui card */}
      <div className="card bg-base-100 shadow-lg p-6 rounded-lg">
        {/* Grid based input fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DestinationInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedLocation={setSelectedDestination}
          />
          <ThemeInput theme={theme} setTheme={setTheme} />
          <DateInput label="Check-in" date={checkIn} setDate={setCheckIn} />
          <DateInput label="Check-out" date={checkOut} setDate={setCheckOut} />
          <TravelersInput travelers={travelers} setTravelers={setTravelers} />
          <BudgetInput budget={budget} setBudget={setBudget} />
        </div>
        {/* Generate button */}
        <div className="flex justify-center mt-6">
          <button className="btn btn-error btn-outline rounded-full w-full sm:w-auto px-6 py-2">
            Generate Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanInputs;
