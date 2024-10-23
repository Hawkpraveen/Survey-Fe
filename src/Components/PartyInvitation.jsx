import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const PartyInvitation = () => {
  const currentUserId = useSelector((state) => state.user.currentUser.user._id);
  const navigate = useNavigate();
  const [title, setTitle] = useState("Party Invitation Form");
  const [description, setDescription] = useState(
    "Please fill out this party invitation form."
  );
  const [questions, setQuestions] = useState([
    {
      question: "What is your name?",
      type: "short_text",
      options: [],
      maxRating: 5,
    },
    {
      question: "Will you attend the party?",
      type: "multiple_choice",
      options: ["Yes", "No", "Maybe"],
      maxRating: 5,
    },
    {
      question: "How many guests will you bring?",
      type: "short_text",
      options: [],
      maxRating: 5,
    },
    {
      question: "Do you have any dietary preferences?",
      type: "long_text",
      options: [],
      maxRating: 5,
    },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "https://survey-be-5d9v.onrender.com/api/survey/create-survey",
        { title, description, questions,user: currentUserId },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      setMessage("Party invitation form submitted successfully!");
      setTitle("Party Invitation Form");
      setDescription("Please fill out this party invitation form.");
      setQuestions([
        {
          question: "What is your name?",
          type: "short_text",
          options: [],
          maxRating: 5,
        },
        {
          question: "Will you attend the party?",
          type: "multiple_choice",
          options: ["Yes", "No", "Maybe"],
          maxRating: 5,
        },
        {
          question: "How many guests will you bring?",
          type: "short_text",
          options: [],
          maxRating: 5,
        },
        {
          question: "Do you have any dietary preferences?",
          type: "long_text",
          options: [],
          maxRating: 5,
        },
      ]);
      setMessage("");
      toast.success("Party invation form added successfully!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error submitting invitation form"
      );
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
      <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-500 mb-4">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={description}
            readOnly
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

            {/* Remove Question Button */}
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
          Submit Party Invitation Form
        </button>
      </form>
    </div>
  );
};

export default PartyInvitation;
