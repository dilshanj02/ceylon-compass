const TransportInput = ({ transport, setTransport }) => {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Transport
      </legend>
      <select
        className="select select-bordered w-full rounded-full focus:outline-none"
        value={transport}
        onChange={(e) => setTransport(e.target.value)}
      >
        <option disabled>Select a transport mode</option>
        <option>Public Transport</option>
        <option>Private Vehicle</option>
        <option>Rental Vehicle</option>
      </select>
    </fieldset>
  );
};

export default TransportInput;
