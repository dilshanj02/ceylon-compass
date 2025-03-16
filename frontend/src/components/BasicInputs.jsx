import DestinationInput from "./DestinationInput";
import ThemeInput from "./ThemeInput";
import DateInput from "./DateInput";

const BasicInputs = ({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors,
}) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div className="max-w-3xl mx-auto">
      {/* Grid based input fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5">
        <DestinationInput
          selectedDestination={formData.destination}
          setSelectedDestination={(value) =>
            setFormData((prev) => ({ ...prev, destination: value }))
          }
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
        <ThemeInput
          theme={formData.theme}
          setTheme={(value) =>
            setFormData((prev) => ({ ...prev, theme: value }))
          }
          validationErrors={validationErrors}
        />
        <DateInput
          label="Check-in"
          date={formData.checkIn}
          setDate={(value) =>
            setFormData((prev) => ({ ...prev, checkIn: value }))
          }
          minDate={today}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
        <DateInput
          label="Check-out"
          date={formData.checkOut}
          setDate={(value) =>
            setFormData((prev) => ({ ...prev, checkOut: value }))
          }
          minDate={formData.checkIn || today} // Check-out must be after check-in
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
      </div>
      {validationErrors.duration && (
        <p className="text-red-500 text-xs mt-1 pl-4">
          {validationErrors.duration}
        </p>
      )}
    </div>
  );
};

export default BasicInputs;
