import DestinationInput from "./DestinationInput";
import ThemeInput from "./ThemeInput";
import DateInput from "./DateInput";

const BasicInputs = ({ formData, setFormData }) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div className="max-w-2xl mx-auto">
      {/* Grid based input fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5">
        <DestinationInput
          searchQuery={formData.searchQuery}
          setSearchQuery={(value) =>
            setFormData((prev) => ({ ...prev, searchQuery: value }))
          }
          setSelectedDestination={(value) =>
            setFormData((prev) => ({ ...prev, selectedDestination: value }))
          }
        />
        <ThemeInput
          theme={formData.theme}
          setTheme={(value) =>
            setFormData((prev) => ({ ...prev, theme: value }))
          }
        />
        <DateInput
          label="Check-in"
          date={formData.checkIn}
          setDate={(value) =>
            setFormData((prev) => ({ ...prev, checkIn: value }))
          }
          minDate={today}
        />
        <DateInput
          label="Check-out"
          date={formData.checkOut}
          setDate={(value) =>
            setFormData((prev) => ({ ...prev, checkOut: value }))
          }
          minDate={formData.checkIn || today} // Check-out must be after check-in
        />
      </div>
    </div>
  );
};

export default BasicInputs;
