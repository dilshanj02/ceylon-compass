import { useState } from "react";
import DestinationInput from "./DestinationInput";
import ThemeSelect from "./ThemeSelect";
import CheckInOut from "./CheckInOut";
import TravelersBudget from "./TravelersBudget";

export default function PlanForm() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* DaisyUI Card for Structured UI */}
      <div className="card bg-base-100 shadow-lg p-6 rounded-lg">
        {/* Input Fields (Grid-Based Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Destination Input */}
          <DestinationInput />

          {/* Trip Theme Selection */}
          <ThemeSelect />

          {/* Check-in and Check-out Date Selection */}
          <CheckInOut />

          {/* Travelers & Budget Fields */}
          <TravelersBudget />
        </div>

        {/* Centered Generate Button */}
        <div className="flex justify-center mt-6">
          <button className="btn btn-error btn-outline rounded-full w-full sm:w-auto px-6 py-2">
            Generate Plan
          </button>
        </div>
      </div>
    </div>
  );
}
