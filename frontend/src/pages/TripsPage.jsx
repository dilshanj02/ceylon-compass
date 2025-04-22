import { useEffect, useState } from "react";
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
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Trips</h1>
      <TripList tripPlans={tripPlans} />
    </section>
  );
};

export default TripPage;
