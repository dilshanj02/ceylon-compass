import { Link } from "react-router-dom";
import axios from "../utils/useAxios";

const TripList = ({ tripPlans, setTripPlans }) => {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/plans/${id}/delete/`);
      setTripPlans((prev) => prev.filter((trip) => trip.id !== id));
    } catch (error) {
      console.error("Failed to delete trip:", error);
      alert("Failed to delete trip. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10">
      <ul className="list bg-base-100 rounded-box shadow-md">
        {tripPlans.map((tripPlan) => (
          <li
            key={tripPlan.id}
            className="list-row grid grid-cols-[2fr_1fr_1fr_auto] items-center gap-6 p-6 border-b"
          >
            <div>
              <div className="text-lg font-semibold">
                {tripPlan.trip.destination_name} : {tripPlan.trip.theme_name}
              </div>
              <div className="text-xs uppercase font-semibold opacity-60">
                {tripPlan.trip.check_in} - {tripPlan.trip.check_out}
              </div>
            </div>
            <p className="text-sm">👥 {tripPlan.trip.travelers} Travelers</p>
            <p className="text-sm">💰 LKR {tripPlan.trip.budget}</p>
            <div className="flex gap-2">
              <Link to={`/trips/${tripPlan.id}`}>
                <button className="btn btn-error">View</button>
              </Link>
              <button
                onClick={() => handleDelete(tripPlan.id)}
                className="btn btn-outline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripList;
