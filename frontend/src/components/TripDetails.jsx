import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../utils/useAxios";

const TripDetails = () => {
  const { id } = useParams();
  const [tripPlan, setTripPlan] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripPlan = async () => {
      try {
        const response = await axios.get(`/api/plans/${id}/`);
        const data = response.data;
        setTripPlan(data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripPlan();
  }, [id]);

  useEffect(() => {
    if (tripPlan?.trip?.destination) {
      axios
        .get(`/api/emergency/?destination=${tripPlan.trip.destination}`)
        .then((response) => setEmergencyContacts(response.data))
        .catch((error) =>
          console.error("Error fetching emergency contacts:", error)
        );
    }
  }, [tripPlan]);

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

      {/* Emergency Assistance */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Emergency Assistance</h3>
        <div className="collapse collapse-arrow border border-base-300 bg-base-100">
          <input type="checkbox" />
          <div className="collapse-title font-semibold flex justify-center items-center text-center p-4">
            View Emergency Contacts for {tripPlan.trip.destination}
          </div>
          <div className="collapse-content space-y-4">
            {emergencyContacts.length === 0 ? (
              <p>No emergency contacts available.</p>
            ) : (
              emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border p-4 rounded-md shadow-sm"
                >
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-sm text-gray-600">
                    {contact.service_type}
                  </p>
                  <p className="text-sm">📞 {contact.phone_number}</p>
                  {contact.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {contact.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
