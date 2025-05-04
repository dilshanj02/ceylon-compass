import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/useAxios";

import TripList from "../components/TripList";

const TripPage = () => {
  const [tripPlans, setTripPlans] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/api/plans/");
        setTripPlans(response.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center text-center py-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Your Trips</h1>

      {tripPlans.length > 0 ? (
        <TripList tripPlans={tripPlans} />
      ) : (
        <div className="flex flex-col items-center gap-6">
          <p className="text-lg text-gray-600">
            You haven't planned any trips yet.
          </p>
          <Link
            to="/plan"
            className="btn btn-error btn-outline rounded-full w-full sm:w-auto px-6 py-2"
          >
            Start Planning Now
          </Link>
        </div>
      )}
    </section>
  );
};

export default TripPage;
