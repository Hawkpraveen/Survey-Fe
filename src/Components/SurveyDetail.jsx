import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const SurveyDetail = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.user.currentUser.user._id);

  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        const response = await axios.get(
          `https://survey-be-5d9v.onrender.com/api/survey/surveys/${surveyId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        setSurvey(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching survey details"
        );
      }
    };

    fetchSurveyDetails();
  }, [surveyId]);

  const handleCheckboxChange = (questionIndex, option) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionIndex] || [];
      if (currentAnswers.includes(option)) {
        return {
          ...prevAnswers,
          [questionIndex]: currentAnswers.filter((ans) => ans !== option),
        };
      } else {
        return {
          ...prevAnswers,
          [questionIndex]: [...currentAnswers, option],
        };
      }
    });
  };

  const handleSubmitSurvey = async () => {
    if (!authToken || !currentUserId) {
      toast.error("Please login to submit the survey.");
      navigate("/login");
      return;
    }

    const formattedAnswers = Object.keys(answers).map((key) => {
      return {
        questionId: survey.questions[key]._id,
        answer: Array.isArray(answers[key]) ? answers[key] : answers[key] || "",
      };
    });

    try {
      const response = await axios.post(
        `https://survey-be-5d9v.onrender.com/api/survey/surveys/${surveyId}/answers`,
        {
          answers: formattedAnswers,
          user: currentUserId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Survey submitted successfully!");
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(
          error.response.data.message ||
            "An error occurred while submitting the survey."
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("No response received from the server.");
      } else {
        console.error("Error message:", error.message);
        toast.error("An error occurred while submitting the survey.");
      }
    }
  };

  const ratingLabels = {
    5: [
      "1 - Very Dissatisfied",
      "2 - Dissatisfied",
      "3 - Neutral",
      "4 - Satisfied",
      "5 - Very Satisfied",
    ],
    6: [
      "1 - Very Dissatisfied",
      "2 - Dissatisfied",
      "3 - Neutral",
      "4 - Satisfied",
      "5 - Very Satisfied",
      "6 - Extremely Satisfied",
    ],
    7: [
      "1 - Very Dissatisfied",
      "2 - Dissatisfied",
      "3 - Somewhat Dissatisfied",
      "4 - Neutral",
      "5 - Somewhat Satisfied",
      "6 - Satisfied",
      "7 - Very Satisfied",
    ],
    8: [
      "1 - Very Dissatisfied",
      "2 - Dissatisfied",
      "3 - Somewhat Dissatisfied",
      "4 - Neutral",
      "5 - Somewhat Satisfied",
      "6 - Satisfied",
      "7 - Very Satisfied",
      "8 - Extremely Satisfied",
    ],
    9: [
      "1 - Very Dissatisfied",
      "2 - Dissatisfied",
      "3 - Somewhat Dissatisfied",
      "4 - Neutral",
      "5 - Slightly Satisfied",
      "6 - Somewhat Satisfied",
      "7 - Satisfied",
      "8 - Very Satisfied",
      "9 - Extremely Satisfied",
    ],
    10: [
      "1 - Very Dissatisfied",
      "2 - Dissatisfied",
      "3 - Somewhat Dissatisfied",
      "4 - Slightly Dissatisfied",
      "5 - Neutral",
      "6 - Slightly Satisfied",
      "7 - Somewhat Satisfied",
      "8 - Satisfied",
      "9 - Very Satisfied",
      "10 - Extremely Satisfied",
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-neutral-100 shadow-lg rounded-lg mt-5 mb-5">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {survey && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Survey Name : {survey.title}
          </h1>
          <p className="mb-6 text-md text-gray-500">
            Survey Description : {survey.description}
          </p>

          {survey.questions.map((q, index) => (
            <div key={index} className="mb-6">
              <h2 className="font-semibold mb-2">
                Question {index + 1}: {q.question}
              </h2>

              {q.type === "short_text" && (
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Your answer"
                  onChange={(e) =>
                    setAnswers({ ...answers, [index]: e.target.value })
                  }
                />
              )}

              {q.type === "long_text" && (
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Your answer"
                  onChange={(e) =>
                    setAnswers({ ...answers, [index]: e.target.value })
                  }
                />
              )}

              {q.type === "multiple_choice" && (
                <ul className="space-y-2">
                  {q.options.map((option, i) => (
                    <li key={i}>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-green-500"
                          onChange={() => handleCheckboxChange(index, option)}
                          checked={answers[index]?.includes(option) || false}
                        />
                        <span>{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {q.type === "checkbox" && (
                <ul className="space-y-2">
                  {q.options.map((option, i) => (
                    <li key={i}>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          className="form-radio h-4 w-4 text-green-500"
                          onChange={() =>
                            setAnswers({ ...answers, [index]: option })
                          }
                        />
                        <span>{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {q.type === "dropdown" && (
                <select
                  className="w-full p-2 border rounded-md"
                  onChange={(e) =>
                    setAnswers({ ...answers, [index]: e.target.value })
                  }
                >
                  <option value="">Select an option</option>
                  {q.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {q.type === "rating" && (
                <div className="flex flex-wrap items-center space-x-4">
                  <div className="flex flex-col md:flex-wrap md:flex-row gap-2">
                    {ratingLabels[q.maxRating]?.map((label, ratingIndex) => (
                      <label key={ratingIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`rating-${index}`}
                          className="form-radio h-4 w-4 text-green-500"
                          onChange={() =>
                            setAnswers({ ...answers, [index]: ratingIndex + 1 })
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {q.type === "time" && (
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) =>
                    setAnswers({ ...answers, [index]: e.target.value })
                  }
                />
              )}

              <hr className="my-4 border-black" />
            </div>
          ))}

          <button
            onClick={handleSubmitSurvey}
            className={`bg-green-500 text-white px-4 py-2 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Survey"}
          </button>
        </>
      )}
    </div>
  );
};

export default SurveyDetail;
