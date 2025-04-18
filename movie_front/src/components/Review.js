import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Review = ({ data }) => {
  const [rreviews, setRReviews] = useState(data);
  const { id } = useParams();

  const [newReview, setNewReview] = useState({
    summary: "",
    reviewText: "",
  });

  useEffect(() => {
    setRReviews(data);
  }, [data]);

  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const addReview = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/addrev/?id=${id}&summary=${newReview.summary}&review=${newReview.reviewText}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const data = await response.json();
      setRReviews(data.new_reviews);
    }
  };

  const handleAddReview = () => {
    if (!newReview.summary.trim() || !newReview.reviewText.trim()) {
      alert("Please fill in both fields.");
      setNewReview({ summary: "", reviewText: "" });
      return;
    }

    addReview();
    setNewReview({ summary: "", reviewText: "" });
  };

  return (
    <div className="mt-9 ml-[310px] p-6 bg-gray-900 shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-2">User Reviews</h2>
      <div
        className="mb-6 p-4 border rounded-lg shadow-md transition-all duration-300"
        style={{
          minHeight: data.length ? "200px" : "100px", // If no reviews, smaller height
          maxHeight: "730px", // Maximum height limit
          height: data.length * 150 + "px", // Increase dynamically based on reviews
        }}
      >
        <div
          className="overflow-y-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            maxHeight: "100%",
          }}
        >
          <div className="space-y-4">
            {rreviews.length
              ? rreviews.map((review, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg shadow-md ${
                      review.rating === 1 ? "bg-green-300" : "bg-red-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <FaUser className="bg-gray-500 rounded-full text-3xl" />
                      <span className="font-semibold">Random Users</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">
                      {review.summary}
                    </h3>
                    <p className="text-gray-700">{review.review}</p>
                  </div>
                ))
              : "no reviews yet"}
          </div>
        </div>
      </div>
      <div className="p-4 mt-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Add Your Review</h2>
        <input
          type="text"
          name="summary"
          placeholder="Review Summary"
          value={newReview.summary}
          onChange={handleInputChange}
          className="mb-2 p-2 w-full border rounded text-black"
        />
        <textarea
          name="reviewText"
          placeholder="Movie Review"
          value={newReview.reviewText}
          onChange={handleInputChange}
          className="mb-2 p-2 w-full border rounded text-black"
        />
        <button
          onClick={handleAddReview}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Review;
