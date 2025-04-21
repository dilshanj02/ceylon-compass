import { useEffect, useState } from "react";
import WriteReview from "../components/WriteReview";
import ReviewList from "../components/ReviewList";
import useAxios from "../utils/useAxios";

const CommunityPage = () => {
  const [reviews, setReviews] = useState([]);
  const [tripPlans, setTripPlans] = useState([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchTrips = () => {
      axios
        .get("http://127.0.0.1:8000/api/plans/")
        .then((response) => {
          setTripPlans(response.data);
          console.log("Fetched trips:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching trips:", error);
        });
    };

    const fetchReviews = () => {
      axios
        .get("http://127.0.0.1:8000/api/reviews/")
        .then((response) => {
          setReviews(response.data);
          console.log("Fetched reviews:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    };

    fetchTrips();
    fetchReviews();
  }, []);

  return (
    <>
      {/* Heading */}
      <section className="flex flex-col items-center justify-center text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Community</h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Write a review about your recent trip and read what others have to
          say!
        </p>
      </section>

      <div className="max-w-3xl mx-auto p-4">
        <WriteReview
          tripPlans={tripPlans}
          reviews={reviews}
          setReviews={setReviews}
        />
        <ReviewList reviews={reviews} />
      </div>
    </>
  );
};

export default CommunityPage;
