import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInputs from "./BasicInputs";
import ProgressIndicator from "./ProgressIndicator";
import PreferencesInputs from "./PreferencesInputs";
import axios from "../utils/useAxios";

import { useContext } from "react";
import CurrencyContext from "../context/CurrencyContext";

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

  const [validationErrors, setValidationErrors] = useState({});
  const [serializerErrors, setSerializerErrors] = useState({});

  const { currency, setCurrency, convert, rates } = useContext(CurrencyContext);

  const mapFormData = (formData) => {
    return {
      ...formData,
      check_in: formData.checkIn,
      check_out: formData.checkOut,
      accommodation_type: formData.accommodationType,
      accommodation_tier: formData.accommodationTier,
      currency: currency,
    };
  };

  const handleNext = () => {
    if (activeStep === 1) {
      let errors = {};
      if (!formData.destination) errors.destination = "Destination is required";
      if (!formData.theme) errors.theme = "Theme is required";
      if (!formData.checkIn) errors.checkIn = "Check-in is required";
      if (!formData.checkOut) errors.checkOut = "Check-out is required";

      if (formData.checkIn && formData.checkOut) {
        const duration =
          (new Date(formData.checkOut) - new Date(formData.checkIn)) /
          (1000 * 3600 * 24);
        if (duration > 5)
          errors.duration = "Trip duration cannot exceed 5 days";
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    }

    setValidationErrors("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setValidationErrors("");
    setActiveStep((prev) => prev - 1);
  };

  const handleReview = () => {
    if (activeStep === 2) {
      let errors = {};
      if (!formData.transport) errors.transport = "Transport is required";
      if (!formData.accommodationType)
        errors.accommodationType = "Accommodation type is required";
      if (!formData.accommodationTier)
        errors.accommodationTier = "Accommodation tier is required";
      if (!formData.budget) errors.budget = "Budget is required";

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    }

    // Clone and convert budget before sending to API
    const payload = {
      ...mapFormData(formData),
      budget: parseFloat(formData.budget) / rates[currency],
    };

    axios
      .post("/api/trips/validate/", payload)
      .then(() => {
        setSerializerErrors("");
        setActiveStep((prev) => prev + 1);
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          setSerializerErrors(error.response.data);
        } else {
          console.error(error);
        }
      });
  };

  const handleSubmit = () => {
    const payload = {
      ...mapFormData(formData),
      budget: parseFloat(formData.budget) / rates[currency],
    };

    axios
      .post("/api/trips/", payload)
      .then((res) => {
        const trip_id = res.data.trip_details.id;
        return axios.post("/api/plans/", { trip_id });
      })
      .then((res) => {
        navigate(`/trips/${res.data.trip_plan.id}`);
      })
      .catch((error) => console.log(error.response));
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
              currency={currency}
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
              <p className="font-semibold">
                {formData.budget} {currency}
              </p>
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
