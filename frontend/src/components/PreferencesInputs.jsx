import TravelersInput from "./TravelersInput";
import BudgetInput from "./BudgetInput";
import TransportInput from "./TransportInput";
import AccommodationInput from "./AccommodationInput";

const PreferencesInputs = ({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors,
  serializerErrors,
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Grid based input fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5">
        <TransportInput
          transport={formData.transport}
          setTransport={(value) =>
            setFormData((prev) => ({ ...prev, transport: value }))
          }
          validationErrors={validationErrors}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5">
          <AccommodationInput
            accommodationType={formData.accommodationType}
            setAccommodationType={(value) =>
              setFormData((prev) => ({ ...prev, accommodationType: value }))
            }
            accommodationTier={formData.accommodationTier}
            setAccommodationTier={(value) =>
              setFormData((prev) => ({ ...prev, accommodationTier: value }))
            }
            validationErrors={validationErrors}
          />
        </div>

        <TravelersInput
          travelers={formData.travelers}
          setTravelers={(value) =>
            setFormData((prev) => ({ ...prev, travelers: value }))
          }
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
        <BudgetInput
          budget={formData.budget}
          setBudget={(value) =>
            setFormData((prev) => ({ ...prev, budget: value }))
          }
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          serializerErrors={serializerErrors}
        />
      </div>
    </div>
  );
};

export default PreferencesInputs;
