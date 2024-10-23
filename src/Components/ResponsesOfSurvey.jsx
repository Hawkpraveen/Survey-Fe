import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SurveyCharts from "./SurveyCharts";

const ResponsesOfSurvey = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const authToken = sessionStorage.getItem("authToken");
  //console.log(surveyId);

  useEffect(() => {
    const fetchSurveyResponses = async () => {
      try {
        const response = await axios.get(
          `https://survey-be-5d9v.onrender.com/api/survey/surveys/${surveyId}/answers`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setResponses(response.data);
      } catch (error) {
        console.error("Error fetching survey responses:", error);
        setError("Error fetching survey responses.");
        toast.error("Unable to fetch survey responses.");
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) {
      fetchSurveyResponses();
    }
  }, [surveyId, authToken]);

  // Function to group responses by user
  const groupAnswersByUser = (responses) => {
    const grouped = {};

    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        if (!grouped[answer.user]) {
          grouped[answer.user] = [];
        }

        grouped[answer.user].push({
          question: response.question,
          answer: answer.answer,
          type: response.type,
          options: response.options,
        });
      });
    });

    return grouped;
  };

  if (loading) {
    return <div>Loading survey responses...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const groupedResponses = groupAnswersByUser(responses);
  const totalResponses = Object.keys(groupedResponses).length;

  // Function to toggle user answers
  const toggleUserAnswers = (user) => {
    setExpandedUser(expandedUser === user ? null : user);
  };

  const handleBackClick = () => {
    navigate("/admin/add-survey");
  };

  return (
    <div className="p-6 w-4/5 mx-auto bg-blue-50 shadow-md rounded-md pb-10 mb-10 mt-5">
      <h1 className="text-3xl font-bold mb-6 text-center">Survey Responses</h1>

      <button
        onClick={handleBackClick}
        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Add Survey
      </button>

      <p className="text-lg mb-4 font-semibold">
        Total Responses: {totalResponses}
      </p>

      {Object.keys(groupedResponses).length === 0 ? (
        <p className="text-gray-500">No responses found for this survey.</p>
      ) : (
        <div className="flex flex-col md:flex-row w-full">
          <div className="md:w-3/5 bg-blue-100 p-4">
            {Object.entries(groupedResponses).map(([user, answers], index) => (
              <div key={index} className="mb-6 p-4 bg-white shadow rounded-lg">
                <button
                  className="w-full text-left font-bold text-xl text-blue-600 hover:text-blue-800 focus:outline-none"
                  onClick={() => toggleUserAnswers(user)}
                >
                  User: {user}
                  <span className="float-right">
                    {expandedUser === user ? "-" : "+"}
                  </span>
                </button>

                {expandedUser === user && (
                  <div className="mt-4">
                    {answers.map((answer, i) => (
                      <div
                        key={i}
                        className="mb-4 p-3 border-l-4 border-blue-500 bg-gray-50 rounded"
                      >
                        <h3 className="font-semibold text-lg text-gray-900">
                          Question {i + 1}:{" "}
                          <span className="text-gray-700">
                            {answer.question}
                          </span>
                        </h3>
                        <p className="ml-4 mt-2">
                          <strong>Answer:</strong> {answer.answer}
                        </p>

                        {answer.type === "checkbox" &&
                          answer.options.length > 0 && (
                            <div className="ml-4 mt-2">
                              <strong>Options:</strong>{" "}
                              {answer.options.join(", ")}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Survey Charts Component */}
          <div className="md:w-4/5">
            <SurveyCharts />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsesOfSurvey;
