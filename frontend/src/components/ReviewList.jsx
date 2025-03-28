import { Star } from "lucide-react";

const ReviewList = ({ reviews }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Recent Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="card shadow-md bg-base-100">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{review.username}</h3>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-sm text-gray-600">
                Destination: {review.destination}
              </p>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${
                      review.rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2">{review.comment}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
