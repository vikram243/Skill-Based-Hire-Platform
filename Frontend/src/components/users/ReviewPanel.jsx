import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import api from "../../lib/axiosSetup";

export default function ReviewDialog({
  isOpen,
  onClose,
  reviewProviderId,
  orderId,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [isAlreadyReviewed, setIsAlreadyReviewed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      // Reset first
      setRating(0);
      setComment("");
      setSelectedSuggestions([]);
      setIsAlreadyReviewed(false);

      fetchReviewByOrders();
    }
  }, [isOpen, orderId]);

  const fetchReviewByOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/api/review/order/${orderId}`);

      if (res?.data?.data) {
        setRating(res?.data?.data?.rating);
        setComment(res?.data?.data?.comment);
        setIsAlreadyReviewed(true);
      } else {
        setIsAlreadyReviewed(false);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setIsAlreadyReviewed(false);
      setLoading(false)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/review/create", {
        provider: reviewProviderId,
        order: orderId,
        rating,
        comment,
      });

      setRating(0);
      setComment("");
      setSelectedSuggestions([]);
      setIsAlreadyReviewed(true); // instantly lock UI
      onClose();
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setSelectedSuggestions([]);
    setIsAlreadyReviewed(false);
    onClose();
  };

  const getSuggestions = () => {
    if (rating >= 4) {
      return [
        "Excellent service",
        "Very professional",
        "On time",
        "Highly recommended",
        "Friendly behavior",
      ];
    } else if (rating === 3) {
      return [
        "Average experience",
        "Could improve timing",
        "Okay service",
        "Satisfactory",
      ];
    } else if (rating > 0) {
      return [
        "Late arrival",
        "Poor communication",
        "Unprofessional",
        "Not satisfied",
      ];
    } else {
      return [];
    }
  };

  const handleSuggestionClick = (text) => {
    if (selectedSuggestions.includes(text)) {
      const updated = selectedSuggestions.filter((t) => t !== text);
      setSelectedSuggestions(updated);
      setComment(updated.join(", "));
    } else {
      const updated = [...selectedSuggestions, text];
      setSelectedSuggestions(updated);
      setComment(updated.join(", "));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        {loading ? (
          <>
          <DialogTitle className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </DialogTitle>
          <DialogDescription></DialogDescription>
          </>
        ) : (
          <>
            <DialogHeader>
              {isAlreadyReviewed ? (
                <>
                  <DialogTitle className="text-sm text-center text-green-600 font-semibold">
                    You already reviewed this order
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </>
              ) : (
                <>
                  <DialogTitle>Leave a Review</DialogTitle>
                  <DialogDescription>Share your experience.</DialogDescription>
                </>
              )}
            </DialogHeader>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  size={28}
                  onClick={() => {
                    if (!isAlreadyReviewed) {
                      setRating(rating === value ? 0 : value);
                    }
                  }}
                  className={`${
                    isAlreadyReviewed ? "cursor-default" : "cursor-pointer"
                  } ${
                    value <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <Textarea
              className="w-full border border-border rounded-md p-2"
              placeholder="Write additional feedback..."
              value={comment}
              disabled={isAlreadyReviewed}
              onChange={(e) => {
                const value = e.target.value;
                setComment(value);

                const currentSuggestions = getSuggestions();

                const matchedSuggestions = currentSuggestions.filter((tag) =>
                  value.includes(tag),
                );

                setSelectedSuggestions(matchedSuggestions);
              }}
            />
            {rating > 0 && !isAlreadyReviewed && (
              <div className="flex flex-wrap gap-2 mb-3">
                {getSuggestions().map((text, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(text)}
                    className={`px-3 py-1 text-sm rounded-full border transition ${
                      selectedSuggestions.includes(text)
                        ? "bg-yellow-400 text-white border-yellow-400"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } ${isAlreadyReviewed ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {text}
                  </Button>
                ))}
              </div>
            )}
            <DialogFooter>
              {!isAlreadyReviewed && (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  className="border-2 border-border bg-blue-500 text-white hover:bg-blue-100 hover:text-blue-500 h-10 px-6 rounded-2xl font-bold"
                  disabled={!rating}
                >
                  Submit
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
