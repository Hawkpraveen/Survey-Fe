import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const EditSurvey = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.user.currentUser.user._id);
  
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    questions: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const questionTypes = [
    { value: "short_text", label: "Short Text" },
    { value: "long_text", label: "Long Text" },
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "checkbox", label: "Checkbox" },
    { value: "dropdown", label: "Dropdown" },
    { value: "rating", label: "Rating" },
    { value: "date", label: "Date" },
  ];

  useEffect(() => {
    const fetchSurvey = async () => {
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
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error fetching survey data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...survey.questions];
    newQuestions[index][field] = value;
    setSurvey((prevSurvey) => ({ ...prevSurvey, questions: newQuestions }));
  };

  const handleAddQuestion = () => {
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions: [
        ...prevSurvey.questions,
        { question: "", type: "short_text", options: [], maxRating: 5 },
      ],
    }));
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = survey.questions.filter((_, i) => i !== index);
    setSurvey((prevSurvey) => ({ ...prevSurvey, questions: newQuestions }));
  };

  const handleAddOption = (index) => {
    const newQuestions = [...survey.questions];
    newQuestions[index].options.push("");
    setSurvey((prevSurvey) => ({ ...prevSurvey, questions: newQuestions }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setSurvey((prevSurvey) => ({ ...prevSurvey, questions: newQuestions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://survey-be-5d9v.onrender.com/api/survey/edit-survey/${surveyId}`,
        { ...survey, user: currentUserId },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Survey updated successfully.");
      navigate("/admin/add-survey"); 
    } catch (error) {
      setError(error.response?.data?.message || "Error updating survey");
    }
  };

  if (loading) return <div>Loading...</div>;
  const handleBackClick = () => {
    navigate("/admin/add-survey");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg pb-5 mb-10 mt-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Survey</h1>
      <button
        onClick={handleBackClick}
        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Add Survey
      </button>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Survey Title</label>
          <input
            type="text"
            name="title"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={survey.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="description"
            value={survey.description}
            onChange={handleChange}
          />
        </div>

        {/* Questions */}
        {survey.questions.map((q, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <label className="block text-gray-700 font-bold mb-2">
              Question {index + 1}
            </label>

            {/* Question Text */}
            <input
              type="text"
              className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your question"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(index, "question", e.target.value)
              }
              required
            />

            {/* Question Type */}
            <label className="block text-gray-700 font-bold mb-2">Question Type</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={q.type}
              onChange={(e) =>
                handleQuestionChange(index, "type", e.target.value)
              }
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Options (for multiple_choice, checkbox, dropdown) */}
            {(q.type === "multiple_choice" ||
              q.type === "checkbox" ||
              q.type === "dropdown") && (
              <div className="mt-4">
                <label className="block text-gray-700 font-bold mb-2">Options</label>
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex mb-2">
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, optionIndex, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => handleAddOption(index)}
                >
                  Add Option
                </button>
              </div>
            )}

            {/* Rating (for rating question type) */}
            {q.type === "rating" && (
              <div className="mt-4">
                <label className="block text-gray-700 font-bold mb-2">Max Rating</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={q.maxRating}
                  onChange={(e) =>
                    handleQuestionChange(index, "maxRating", e.target.value)
                  }
                  min="1"
                  max="10"
                  required
                />
              </div>
            )}

            <button
              type="button"
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => handleRemoveQuestion(index)}
            >
              Remove Question
            </button>
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Update Survey
        </button>
      </form>
    </div>
  );
};

export default EditSurvey;
