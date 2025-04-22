import { useState } from "react";
import { Star } from "lucide-react";
import axios from "../utils/useAxios";

const WriteReview = ({ tripPlans, reviews, setReviews }) => {
  const [form, setForm] = useState({
    tripPlanId: "",
    rating: 0,
    comment: "",
  });

  const handleTripSelect = (e) => {
    const selectedPlanId = parseInt(e.target.value);
    const selectedPlan = tripPlans.find((plan) => plan.id === selectedPlanId);

    if (selectedPlan) {
      setForm({
        ...form,
        tripPlanId: selectedPlanId,
        destination: selectedPlan.destination,
      });
    }
  };

  const handleSubmit = () => {
    axios
      .post("/api/reviews/", {
        trip_plan: form.tripPlanId,
        rating: form.rating,
        comment: form.comment,
      })
      .then((response) => {
        const newReview = {
          ...response.data,
          user: "You", // Or fetch username from auth
          date: "Just now", // Temporary label for frontend
        };
        console.log(response.data);
        setReviews([newReview, ...reviews]);
        setForm({
          tripPlanId: "",
          rating: 0,
          comment: "",
        });
      })
      .catch((error) => {
        console.error("Failed to submit review:", error);
      });
  };

  if (!tripPlans || tripPlans.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-10">
        <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
        <p className="text-gray-500">
          🛑 You need to create a trip plan before you can write a review.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-10">
      <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
      <div className="space-y-4">
        <select
          className="select select-bordered w-full focus:outline-none"
          value={form.tripPlanId || ""}
          onChange={handleTripSelect}
        >
          <option value="">Select a Trip Plan</option>
          {tripPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.trip.destination} - {plan.trip.theme}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Your thoughts about the destination..."
          className="textarea textarea-bordered w-full focus:outline-none"
          value={form.comment || ""}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        ></textarea>

        <div className="flex items-center space-x-2">
          <span className="font-medium">Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={`cursor-pointer ${
                form.rating >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
              onClick={() => setForm({ ...form, rating: star })}
            />
          ))}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!form.tripPlanId || !form.comment || !form.rating}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default WriteReview;
