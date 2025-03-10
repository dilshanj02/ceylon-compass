import { useState } from "react";
import TravelersInput from "./TravelersInput";
import BudgetInput from "./BudgetInput";
import TransportInput from "./TransportInput";
import AccomodationInput from "./AccomodationInput";

const PreferencesInputs = () => {
  const [transport, setTransport] = useState("");
  const [accomodation, setAccomodation] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Grid based input fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5">
        <TransportInput transport={transport} setTransport={setTransport} />
        <AccomodationInput
          accomodation={accomodation}
          setAccomodation={setAccomodation}
        />
        <TravelersInput travelers={travelers} setTravelers={setTravelers} />
        <BudgetInput budget={budget} setBudget={setBudget} />
      </div>
    </div>
  );
};

export default PreferencesInputs;
