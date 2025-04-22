import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInputs from "./BasicInputs";
import ProgressIndicator from "./ProgressIndicator";
import PreferencesInputs from "./PreferencesInputs";
import axios from "../utils/useAxios";

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
    accommodationType: "",
    accommodationTier: "",
  });
  const [validationErrors, setValidationErrors] = useState({}); // Frontend validation
  const [serializerErrors, setSerializerErrors] = useState({}); // Backend validation

  const mapFormData = (formData) => {
    return {
      destination: formData.destination,
      theme: formData.theme,
      check_in: formData.checkIn,
      check_out: formData.checkOut,
      accommodation_type: formData.accommodationType,
      accommodation_tier: formData.accommodationTier,
      transport: formData.transport,
      travelers: formData.travelers,
      budget: formData.budget,
    };
  };

  const handleNext = () => {
    if (activeStep === 1) {
      let errors = {};

      if (!formData.destination) {
        errors.destination = "Destination is required";
      }
      if (!formData.theme) {
        errors.theme = "Theme is required";
      }
      if (formData.checkIn.trim() === "") {
        errors.checkIn = "Check-in date is required";
      }
      if (formData.checkOut.trim() === "") {
        errors.checkOut = "Check-out date is required";
      }

      if (formData.checkIn && formData.checkOut) {
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);

        const duration = (checkOutDate - checkInDate) / (1000 * 3600 * 24);

        // Max trip days is 5
        if (duration > 5) {
          errors.duration = "Trip duration cannot be greater than 5 days";
        }
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    }

    setValidationErrors(""); // Clear error if valid
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setValidationErrors("");
    setActiveStep((prev) => prev - 1);
  };

  const handleReview = () => {
    if (activeStep === 2) {
      let errors = {};

      if (formData.transport.trim() === "") {
        errors.transport = "Transport is required";
      }
      if (formData.accommodationType.trim() === "") {
        errors.accommodationType = "Accomodation type is required";
      }
      if (formData.accommodationTier.trim() === "") {
        errors.accommodationTier = "Accomodation tier is required";
      }
      if (formData.budget.trim() === "") {
        errors.budget = "Budget is required";
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    }

    const payload = mapFormData(formData);

    axios
      .post("/api/trips/validate/", payload)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);

          setSerializerErrors(""); // Clear error if valid
          setActiveStep((prev) => prev + 1);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.log("Validation error:", error.response.data);
          setSerializerErrors(error.response.data);
        } else {
          console.error("Unexpected error:", error.message);
        }
      });
  };

  const handleSubmit = () => {
    const payload = mapFormData(formData);

    axios
      .post("/api/trips/", payload)
      .then((response) => {
        if (response.status === 201) {
          console.log(response.data);
          const trip_id = response.data.trip_details.id;

          axios
            .post("/api/plans/", { trip_id: trip_id })
            .then((response) => {
              if (response.status === 201) {
                console.log(response.data);
                navigate(`/trips/${response.data.trip_plan.id}`);
              }
            })
            .catch((error) => {
              console.log(error.response);
            });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className="max-w-3xl mx-auto my-10">
      <ProgressIndicator activeStep={activeStep} />

      {/* Basic inputs */}
      <div className="collapse bg-base-100 border border-base-300">
        <input
          type="radio"
          name="plan-accordion"
          checked={activeStep === 1}
          readOnly
        />
        <div className="collapse-title font-semibold flex justify-center items-center text-center p-4">
          Basic Information
        </div>
        <div className="collapse-content text-sm">
          {activeStep === 1 && (
            <BasicInputs
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
            />
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
          name="plan-accordion"
          checked={activeStep === 2}
          readOnly
        />
        <div className="collapse-title font-semibold text-center p-4">
          Preferences
        </div>
        <div className="collapse-content text-sm">
          {activeStep === 2 && (
            <PreferencesInputs
              formData={formData}
              setFormData={setFormData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              serializerErrors={serializerErrors}
            />
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
              onClick={handleReview}
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
          name="plan-accordion"
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
              <p className="font-semibold">
                {formData.accommodationType} ( {formData.accommodationTier} )
              </p>
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
