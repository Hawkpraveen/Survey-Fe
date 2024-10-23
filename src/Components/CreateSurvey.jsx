import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateSurvey = () => {
  const currentUserId = useSelector((state) => state.user.currentUser.user._id);
  //console.log(currentUserId);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", type: "short_text", options: [], maxRating: 5 },
  ]);
  const [message, setMessage] = useState("");
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

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", type: "short_text", options: [], maxRating: 5 },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push("");
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post(
        "https://survey-be-5d9v.onrender.com/api/survey/create-survey",
        { title, description, questions, user: currentUserId },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      setMessage("Survey created successfully!");
      toast.success(` Survey ${title} created successfully !`);
      navigate("/");
      setTitle("");
      setDescription("");
      setQuestions([
        { question: "", type: "short_text", options: [], maxRating: 5 },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating survey");
      console.log(error);
    }
  };
  const handleBack = () => {
    navigate("/admin/add-survey");
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg pb-5 mb-10 mt-5">
      <button
        className="mt-4  px-4 py-2 bg-gray-500 text-white rounded-lg"
        onClick={handleBack}
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4 text-center">Create Survey</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-500 mb-4">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Survey Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
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
            <label className="block text-gray-700 font-bold mb-2">
              Question Type
            </label>
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
                <label className="block text-gray-700 font-bold mb-2">
                  Options
                </label>
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
                <label className="block text-gray-700 font-bold mb-2">
                  Max Rating
                </label>
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
          Create Survey
        </button>
      </form>
    </div>
  );
};

export default CreateSurvey;
