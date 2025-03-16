import { useEffect } from "react";

const AccommodationInput = ({
  accommodationType,
  setAccommodationType,
  accommodationTier,
  setAccommodationTier,
  validationErrors,
}) => {
  useEffect(() => {
    if (!accommodationType) {
      setAccommodationType("Hotel");
    }

    if (!accommodationTier) {
      setAccommodationTier("Luxury");
    }
  }, [accommodationType, accommodationTier]);

  return (
    <>
      <fieldset>
        <legend className="text-sm font-semibold text-gray-600 pl-4">
          Accommodation Type
        </legend>
        <select
          className="select select-bordered w-full rounded-full focus:outline-none"
          value={accommodationType}
          onChange={(e) => setAccommodationType(e.target.value)}
        >
          <option disabled>Select a accommodation type</option>
          <option>Hotel</option>
          <option>Villa</option>
          <option>Guesthouse</option>
          <option>Resort</option>
        </select>
        {validationErrors.accommodation_type && (
          <p className="text-red-500 tsext-xs mt-1 pl-4">
            Please select a valid accommodation type
          </p>
        )}
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold text-gray-600 pl-4">
          Accommodation Tier
        </legend>
        <select
          className="select select-bordered w-full rounded-full focus:outline-none"
          value={accommodationTier}
          onChange={(e) => setAccommodationTier(e.target.value)}
        >
          <option disabled>Select a accommodation tier</option>
          <option>Luxury</option>
          <option>Mid-range</option>
          <option>Budget</option>
        </select>
        {validationErrors.accommodation_tier && (
          <p className="text-red-500 text-xs mt-1 pl-4">
            Please select a valid accommodation tier
          </p>
        )}
      </fieldset>
    </>
  );
};

export default AccommodationInput;
