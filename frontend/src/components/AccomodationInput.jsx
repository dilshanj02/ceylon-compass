const AccomodationInput = ({ accomodation, setAccomodation }) => {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Accomodation
      </legend>
      <select
        className="select select-bordered w-full rounded-full focus:outline-none"
        value={accomodation}
        onChange={(e) => setAccomodation(e.target.value)}
      >
        <option disabled>Select a accomodation option</option>
        <option>Hotel</option>
        <option>Villa</option>
        <option>Guesthouse</option>
      </select>
    </fieldset>
  );
};

export default AccomodationInput;
