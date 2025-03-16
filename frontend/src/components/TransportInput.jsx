import { useEffect } from "react";

const TransportInput = ({ transport, setTransport, validationErrors }) => {
  useEffect(() => {
    if (!transport) {
      setTransport("Public");
    }
  }, [transport]);

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
        <option>Public</option>
        <option>Private</option>
        <option>Rental</option>
      </select>
      {validationErrors.transport && (
        <p className="text-red-500 text-xs mt-1 pl-4">
          Please select a valid transport
        </p>
      )}
    </fieldset>
  );
};

export default TransportInput;
