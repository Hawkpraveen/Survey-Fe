import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import axios from "axios";
import { useParams } from "react-router-dom";

const SurveyCharts = () => {
  const [ratingData, setRatingData] = useState([]);
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
      }
    };

    fetchRatingData();
  }, [surveyId]);

  return (
    <div className="w-full  mt-10 md:mt-0 md:ml-6 pb-10">
      <h2 className="text-xl font-bold mb-4 text-center">
        Survey Rating Charts
      </h2>
      {ratingData.length > 0 ? (
        ratingData.map((ratingQuestion, index) => (
          <div key={index} className="mb-8 ">
            <h3 className="text-lg font-semibold mb-4 text-left text-ellipsis">
              Question : {ratingQuestion.question}
            </h3>
            <div className="flex flex-col  gap-2">
              <div className="w-full sm:w-1/2 mx-auto">
                <PieChart
                  ratings={ratingQuestion.ratings}
                  question={ratingQuestion.question}
                />
              </div>
              <hr className="border-2 border-blue-200 max-w-lg mx-auto" />
              <div className="w-full sm:w-1/2  mx-auto h-full">
                <BarChart
                  ratings={ratingQuestion.ratings}
                  question={ratingQuestion.question}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No rating data available.</p>
      )}
    </div>
  );
};

export default SurveyCharts;
