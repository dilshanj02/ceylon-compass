import { useState } from "react";
import BasicInputs from "./BasicInputs";
import ProgressIndicator from "./ProgressIndicator";
import PreferencesInputs from "./PreferencesInputs";

const PlanAccordion = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    searchQuery: "",
    selectedDestination: "",
    theme: "",
    checkIn: "",
    checkOut: "",
    travelers: 1,
    budget: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    console.log("Form Data:", formData); // Debugging: Check current state in console

    if (activeStep === 1) {
      if (
        formData.selectedDestination.trim() === "" ||
        formData.theme.trim() === "" ||
        formData.checkIn.trim() === "" ||
        formData.checkOut.trim() === ""
      ) {
        setErrorMessage(
          "Please fill in all required fields before proceeding."
        );
        return;
      }
    }

    setErrorMessage(""); // Clear error if valid
    setActiveStep(activeStep + 1);
  };

  return (
    <div className="max-w-3xl mx-auto my-10">
      <ProgressIndicator activeStep={activeStep} />

      {/* Basic inputs */}
      <div className="collapse bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion"
          checked={activeStep === 1}
          onChange={() => setActiveStep(1)}
        />
        <div className="collapse-title font-semibold flex justify-center items-center text-center p-4">
          Basic Information
        </div>
        <div className="collapse-content text-sm">
          {activeStep === 1 && (
            <BasicInputs formData={formData} setFormData={setFormData} />
          )}
          {errorMessage && (
            <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
          )}
          <div className="flex justify-center mt-6">
            <button
              className="btn btn-error btn-outline rounded-full w-full sm:w-auto px-6 py-2"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Preferences inputs */}
      <div className="collapse bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion"
          checked={activeStep === 2}
          readOnly
        />
        <div className="collapse-title font-semibold text-center p-4">
          Preferences
        </div>
        <div className="collapse-content text-sm">
          {activeStep === 2 && (
            <PreferencesInputs formData={formData} setFormData={setFormData} />
          )}
          <div className="flex justify-center mt-6">
            <button
              className="btn btn-error btn-outline rounded-full w-full sm:w-auto px-6 py-2"
              onClick={handleNext}
            >
              Review
            </button>
          </div>
        </div>
      </div>
      <div className="collapse bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion"
          checked={activeStep === 3}
          onChange={() => setActiveStep(3)}
        />
        <div className="collapse-title font-semibold flex justify-center items-center text-center p-4">
          Review & Submit
        </div>
        <div className="collapse-content text-sm">
          Go to "My Account" settings and select "Edit Profile" to make changes.
        </div>
      </div>
    </div>
  );
};

export default PlanAccordion;
