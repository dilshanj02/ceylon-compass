import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInputs from "./BasicInputs";
import ProgressIndicator from "./ProgressIndicator";
import PreferencesInputs from "./PreferencesInputs";

const PlanAccordion = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    theme: "",
    checkIn: "",
    checkOut: "",
    travelers: 1,
    budget: "",
    transport: "",
    accommodation: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    if (activeStep === 1) {
      if (
        formData.destination.trim() === "" ||
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

    if (activeStep === 2) {
      if (
        formData.transport.trim() === "" ||
        formData.accommodation.trim() === "" ||
        formData.budget.trim() === ""
      ) {
        setErrorMessage(
          "Please fill in all required fields before proceeding."
        );
        return;
      }
    }

    setErrorMessage(""); // Clear error if valid
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const tripId = Date.now().toString();

    localStorage.setItem(`trip-${tripId}`, JSON.stringify(formData));

    navigate(`/trips/${tripId}`);
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
          readOnly
        />
        <div className="collapse-title font-semibold flex justify-center items-center text-center p-4">
          Basic Information
        </div>
        <div className="collapse-content text-sm">
          {activeStep === 1 && (
            <BasicInputs formData={formData} setFormData={setFormData} />
          )}
          {errorMessage && activeStep === 1 && (
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
          {errorMessage && activeStep === 2 && (
            <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
          )}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center relative gap-4 mt-6">
            <button
              className="btn btn-outline rounded-full w-full sm:w-auto px-6 py-2"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              className="btn btn-error btn-outline rounded-full w-full sm:w-auto px-6 py-2 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2"
              onClick={handleNext}
            >
              Review
            </button>
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="collapse bg-base-100 border border-base-300">
        <input
          type="radio"
          name="my-accordion"
          checked={activeStep === 3}
          readOnly
        />
        <div className="collapse-title font-semibold flex justify-center items-center text-center p-4">
          Review & Submit
        </div>
        <div className="collapse-content text-sm">
          {/* <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center relative gap-4 mt-6"> */}

          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Destination</p>
              <p className="font-semibold">{formData.destination}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Theme</p>
              <p className="font-semibold">{formData.theme}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Check-in</p>
              <p className="font-semibold">{formData.checkIn}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Check-out</p>
              <p className="font-semibold">{formData.checkOut}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Transport</p>
              <p className="font-semibold">{formData.transport}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Accommodation</p>
              <p className="font-semibold">{formData.accommodation}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Travelers</p>
              <p className="font-semibold">{formData.travelers}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Budget</p>
              <p className="font-semibold">{formData.budget} LKR</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center relative gap-4 mt-6">
            <button
              className="btn btn-outline rounded-full w-full sm:w-auto px-6 py-2"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              className="btn btn-error btn-outline rounded-full w-full sm:w-auto px-6 py-2 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanAccordion;
