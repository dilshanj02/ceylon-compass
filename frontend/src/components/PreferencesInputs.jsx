import TravelersInput from "./TravelersInput";
import BudgetInput from "./BudgetInput";
import TransportInput from "./TransportInput";
import AccommodationInput from "./AccommodationInput";

const PreferencesInputs = ({ formData, setFormData }) => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Grid based input fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5">
        <TransportInput
          transport={formData.transport}
          setTransport={(value) =>
            setFormData((prev) => ({ ...prev, transport: value }))
          }
        />
        <AccommodationInput
          accommodation={formData.accommodation}
          setAccommodation={(value) =>
            setFormData((prev) => ({ ...prev, accommodation: value }))
          }
        />
        <TravelersInput
          travelers={formData.travelers}
          setTravelers={(value) =>
            setFormData((prev) => ({ ...prev, travelers: value }))
          }
        />
        <BudgetInput
          budget={formData.budget}
          setBudget={(value) =>
            setFormData((prev) => ({ ...prev, budget: value }))
          }
        />
      </div>
    </div>
  );
};

export default PreferencesInputs;
