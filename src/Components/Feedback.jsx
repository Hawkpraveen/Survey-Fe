import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Feedback = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    const fetchAnsweredSurveys = async () => {
      try {
        const response = await axios.get(
          "https://survey-be-5d9v.onrender.com/api/survey/get-answered-survey",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const filteredSurveys = response.data.filter((survey) =>
          survey.answers.some((answer) => typeof answer.answer === "number")
        );

        if (filteredSurveys.length === 0) {
          setError("You have not taken any rating surveys yet.");
        } else {
          setSurveys(filteredSurveys);
        }
      } catch (err) {
        setError("Error fetching surveys.");
        toast.error("Unable to fetch surveys.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnsweredSurveys();
  }, [authToken]);
console.log(surveys);

  if (loading)
    return <p className="text-center">Loading survey responses...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const calculateFeedback = (surveyAnswers) => {
    const ratingAnswers = surveyAnswers.filter(
      (answer) => typeof answer.answer === "number"
    );

    if (ratingAnswers.length === 0) {
      return "No rating questions found in this survey.";
    }

    // Calculate total maximum rating and user's total rating
    const totalMaxRating = ratingAnswers.reduce(
      (total, answer) => total + answer.maxRating,
      0
    );
    const userRating = ratingAnswers.reduce(
      (sum, answer) => sum + answer.answer,
      0
    );
    const ratingPercentage = (userRating / totalMaxRating) * 100;

    let feedbackMessage = "";
    if (ratingPercentage >= 90) {
      feedbackMessage = "Excellent! You rated this survey very highly.";
    } else if (ratingPercentage >= 80) {
      feedbackMessage = "Very Good! You rated this survey positively.";
    } else if (ratingPercentage >= 70) {
      feedbackMessage = "Good! You seemed mostly satisfied with the survey.";
    } else if (ratingPercentage >= 60) {
      feedbackMessage = "Satisfactory! You found some aspects acceptable.";
    } else if (ratingPercentage >= 50) {
      feedbackMessage = "Average! There were some aspects you were satisfied with.";
    } else if (ratingPercentage >= 40) {
      feedbackMessage = "Below Average! You found some aspects lacking.";
    } else if (ratingPercentage >= 30) {
      feedbackMessage = "Below Average! You had some concerns.";
    } else if (ratingPercentage >= 20) {
      feedbackMessage = "Poor! You had many concerns with this survey.";
    } else {
      feedbackMessage = "Very Poor! You were largely dissatisfied with this survey.";
    }

    return `You rated ${userRating} out of ${totalMaxRating}. ${feedbackMessage}`;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Survey Feedback</h2>
      {surveys.map((survey, index) => (
        <div
          key={index}
          className="border border-gray-300 p-4 rounded-lg mb-4 shadow-md"
        >
          <h3 className="text-xl font-semibold">{survey.surveyTitle}</h3>
          <p className="text-gray-700 mb-2">{survey.surveyDescription}</p>
          <p className="text-sm text-gray-500 mb-2">
            Submitted on: {new Date(survey.submittedAt).toLocaleString()}
          </p>
          <p className="text-md font-medium">
            {calculateFeedback(survey.answers)}
          </p>
        </div>
      ))}
      {surveys.length === 0 && (
        <p className="text-center text-gray-500">
          No surveys with ratings found.
        </p>
      )}
    </div>
  );
};

export default Feedback;
