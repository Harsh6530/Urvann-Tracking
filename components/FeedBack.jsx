"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/feedback/Button";
import { Textarea } from "@/components/feedback/Textarea";
import { cn } from "@/lib/utils";

export default function FeedbackForm({ onSubmit }) {
  const [productRating, setProductRating] = useState(null);
  const [riderRating, setRiderRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // API call to save feedback
    try {
      await fetch("/api/save-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productRating, riderRating, feedback }),
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    onSubmit(); // Mark as submitted

    setTimeout(() => {
      setProductRating(null);
      setRiderRating(null);
      setFeedback("");
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Thank You!</h2>
        <p className="text-gray-600">Your feedback has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-500 mb-2">Feedback to Product</h3>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={`product-${star}`} type="button" onClick={() => setProductRating(star)}>
                <Star className={cn("w-8 h-8", productRating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-400")} />
              </button>
            ))}
          </div>

          <h3 className="text-lg font-medium text-blue-500 mb-2">Feedback to Rider</h3>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={`rider-${star}`} type="button" onClick={() => setRiderRating(star)}>
                <Star className={cn("w-8 h-8", riderRating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-400")} />
              </button>
            ))}
          </div>

          <h3 className="text-lg font-medium text-blue-500 mb-2">Your Feedback</h3>
          <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Write a Review" />

        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setFeedback("")}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || (!productRating && !riderRating && !feedback)}>Submit</Button>
        </div>
      </form>
    </div>
  );
}