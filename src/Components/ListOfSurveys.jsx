import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ListOfSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(
          "https://survey-be-5d9v.onrender.com/api/survey/all-surveys",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        setSurveys(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching surveys");
      }
    };

    fetchSurveys();
  }, []);

  const handleSurveyClick = (surveyId) => {
    const authToken = sessionStorage.getItem("authToken");

    if (!authToken) {
      toast.error("Please login to view the survey.");
      navigate("/login");
    } else {
      navigate(`/survey/${surveyId}`);
    }
  };

  return (
    <div className="p-6 pb-10 mb-10">
      <h1 className="text-2xl font-bold mb-4 text-center pb-4">
        Available Surveys
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Check if surveys are available */}
      {surveys.length === 0 ? (
        <div className="text-gray-500 text-center">No surveys available.</div>
      ) : (
        <div className=" items-center flex flex-col md:flex-row justify-between  space-y-6 md:space-y-0 ">
          {surveys.map((survey) => (
            <div
              key={survey._id}
              className="p-4 text-center border rounded-lg shadow-lg flex flex-col justify-center items-center bg-blue-100 hover:shadow-xl cursor-pointer w-56 h-52 text-ellipsis mx-auto"
              onClick={() => handleSurveyClick(survey._id)}
            >
              <h2 className="text-lg font-semibold mb-2">{survey.title}</h2>
              <p className="text-gray-600 truncate">{survey.description}</p>
              <div className="mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  View Survey
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListOfSurveys;
