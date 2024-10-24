import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart"; 
import axios from "axios";
import { useParams } from "react-router-dom";

const SurveyCharts = () => {
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(null); // Track which question's charts are visible
  const [showOverallScores, setShowOverallScores] = useState(false); // Track if overall scores should be shown
  const { surveyId } = useParams();
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const response = await axios.get(
          `https://survey-be-5d9v.onrender.com/api/survey/survey/${surveyId}/rating-data`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setRatingData(response.data);
      } catch (error) {
        console.error("Error fetching rating data:", error);
        setError("Failed to load rating data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatingData();
  }, [surveyId, authToken]);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const handleToggleQuestionCharts = (index) => {
    if (visibleQuestionIndex === index) {
      setVisibleQuestionIndex(null); // Close if the same question is clicked again
    } else {
      setVisibleQuestionIndex(index); // Open the selected question
    }
  };

  return (
    <div className="w-full mt-10 md:mt-0 md:ml-6 pb-10">
      <h2 className="text-xl font-bold mb-4 text-center">
        Survey Rating Charts
      </h2>
      {ratingData.length > 0 ? (
        ratingData.map((ratingQuestion, index) => (
          <div key={index} className="mb-8">
            <button
              className="w-full sm:w-1/2 mx-auto p-2 bg-blue-500 text-white font-semibold rounded-lg mb-4"
              onClick={() => handleToggleQuestionCharts(index)}
            >
              {visibleQuestionIndex === index
                ? `Hide Charts for Question ${index + 1}`
                : `Show Charts for Question ${index + 1}`}
            </button>

            {/* Conditionally render Pie and Bar charts based on question visibility */}
            {visibleQuestionIndex === index && (
              <div className="flex flex-col gap-2">
                <div className="w-full sm:w-1/2 mx-auto">
                  <PieChart
                    ratings={ratingQuestion.ratings}
                    question={ratingQuestion.question}
                  />
                </div>
                <hr className="border-2 border-blue-200 max-w-lg mx-auto" />
                <div className="w-full sm:w-1/2 mx-auto h-full">
                  <BarChart
                    ratings={ratingQuestion.ratings}
                    question={ratingQuestion.question}
                  />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No rating data available.</p>
      )}

      {/* Button to show/hide overall scores */}
      <button
        className="w-full sm:w-1/2 mx-auto p-2 bg-green-500 text-white font-semibold rounded-lg mt-6"
        onClick={() => setShowOverallScores(!showOverallScores)}
      >
        {showOverallScores ? "Hide Overall Scores" : "Show Overall Scores"}
      </button>

      {/* Conditionally render the LineChart for overall scores */}
      {showOverallScores && (
        <div className="w-full sm:w-1/2 mx-auto h-full mt-4">
          <LineChart surveyId={surveyId} />
        </div>
      )}
    </div>
  );
};

export default SurveyCharts;
