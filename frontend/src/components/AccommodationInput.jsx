import { useEffect } from "react";

const AccommodationInput = ({ accommodation, setAccommodation }) => {
  useEffect(() => {
    if (!accommodation) {
      setAccommodation("Hotel");
    }
  }, [accommodation]);

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Accommodation
      </legend>
      <select
        className="select select-bordered w-full rounded-full focus:outline-none"
        value={accommodation}
        onChange={(e) => setAccommodation(e.target.value)}
      >
        <option disabled>Select a accommodation option</option>
        <option>Hotel</option>
        <option>Villa</option>
        <option>Guesthouse</option>
      </select>
    </fieldset>
  );
};

export default AccommodationInput;
