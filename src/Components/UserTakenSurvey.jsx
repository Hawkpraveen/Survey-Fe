import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserTakenSurvey = () => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = useSelector((state) => state.user.currentUser.user._id);
  const authToken = sessionStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAnswers = async () => {
      try {
        const response = await axios.get(
          "https://survey-be-5d9v.onrender.com/api/survey/get-answered-survey",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setUserAnswers(response.data);
      } catch (error) {
        console.error("Error fetching user answers:", error);
        toast.error("Error fetching your submitted surveys.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken && currentUserId) {
      fetchUserAnswers();
    } else {
      toast.error("Please login to view your submitted surveys.");
    }
  }, [authToken, currentUserId]);
  //console.log(userAnswers);
  if (loading) {
    return <div>Loading...</div>;
  }

  const hasRatingQuestions = (answers) => {
    return answers.some((answer) => typeof answer.answer === "number");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Your Submitted Surveys</h1>

      {userAnswers.length === 0 ? (
        <p className="text-gray-500">You haven't taken any surveys yet.</p>
      ) : (
        userAnswers.map((answer, index) => (
          <div key={index} className="mb-6">
            <h2 className="font-semibold mb-2">Survey: {answer.surveyTitle}</h2>
            <p className="text-gray-700 mb-2">
              Description: {answer.surveyDescription}
            </p>
            <p className="text-sm text-gray-500">
              Submitted At: {new Date(answer.submittedAt).toLocaleString()}
            </p>

            {/* Check for rating questions and provide a button to navigate to feedback */}
            {hasRatingQuestions(answer.answers) && (
              <button
                onClick={() => navigate("/feedback")}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Feedback
              </button>
            )}
            <hr className="my-4" />
          </div>
        ))
      )}
    </div>
  );
};

export default UserTakenSurvey;
