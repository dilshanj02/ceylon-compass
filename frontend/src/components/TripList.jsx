import { Link } from "react-router-dom";

const TripList = ({ tripPlans }) => {
  return (
    <div className="max-w-6xl mx-auto my-10">
      <ul className="list bg-base-100 rounded-box shadow-md">
        {tripPlans.map((tripPlan) => (
          <li
            key={tripPlan.id}
            className="list-row grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-10 p-6 border-b"
          >
            <div>
              <div className="text-lg">
                {tripPlan.trip.destination} : {tripPlan.trip.theme}
              </div>
              <div className="text-s uppercase font-semibold opacity-60">
                {tripPlan.trip.check_in} - {tripPlan.trip.check_out}
              </div>
            </div>
            <p className="text-s">Travelers: {tripPlan.trip.travelers}</p>
            <p className="text-s">Budget: {tripPlan.trip.budget}</p>
            <Link to={`/trips/${tripPlan.id}`}>
              <button className="btn btn-error">View</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripList;
