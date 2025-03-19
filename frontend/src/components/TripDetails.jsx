import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const TripDetails = () => {
  const { id } = useParams();
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripPlan = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/plans/${id}/`);
        const data = await response.json();
        setTripPlan(data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripPlan();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!tripPlan) return <p>Trip not found.</p>;

  const labelMap = {
    accommodation: "Accommodation",
    transport: "Transport",
    food: "Food",
    misc: "Miscellaneous",
    total: "Total Cost",
    remaining_budget: "Remaining Budget",
  };

  const orderedKeys = [
    "accommodation",
    "transport",
    "food",
    "misc",
    "total",
    "remaining_budget",
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Trip Heading */}
      <div>
        <h2 className="text-4xl font-bold mb-20">
          {tripPlan.trip.destination} - {tripPlan.trip.theme}
        </h2>
        <div className="border-b border-base-300 mb-6"></div>

        {/* Trip Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <span className="w-28 font-semibold">Check-in:</span>
              <span>{tripPlan.trip.check_in}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-semibold">Check-out:</span>
              <span>{tripPlan.trip.check_out}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <span className="w-28 font-semibold">Travelers:</span>
              <span>{tripPlan.trip.travelers}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 font-semibold">Budget:</span>
              <span>LKR {tripPlan.trip.budget}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Itinerary</h3>
        <ul className="divide-y divide-base-300">
          {tripPlan.itinerary.map((item, index) => (
            <li key={index} className="py-4 flex justify-between items-center">
              <div>
                <strong>{item.date}</strong>: {item.activity}
              </div>
              <span className="badge badge-outline">
                LKR {item.budget_remaining} left
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cost Breakdown */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Cost Breakdown</h3>
        <ul className="divide-y divide-base-300">
          {orderedKeys.map((key) => (
            <li key={key} className="py-3 flex justify-between">
              <span>{labelMap[key]}</span>
              <span className="badge badge-primary badge-outline">
                LKR {tripPlan.cost_breakdown[key]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TripDetails;
