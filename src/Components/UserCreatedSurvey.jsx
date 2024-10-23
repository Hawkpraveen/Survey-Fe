import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { FaEllipsisV } from "react-icons/fa";

Modal.setAppElement("#root");

const UserCreatedSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [dropdownVisibleId, setDropdownVisibleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(
          "https://survey-be-5d9v.onrender.com/api/survey/get-user-survey",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );

        setSurveys(response.data.surveys);
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

  const handleEditClick = (surveyId) => {
    navigate(`/admin/edit-survey/${surveyId}`);
  };

  const handleOpenResponse = (surveyId) => {
    navigate(`/admin/survey/${surveyId}/responses`);
  };

  const openModal = (surveyId) => {
    setSurveyToDelete(surveyId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSurveyToDelete(null);
  };

  const handleDeleteClick = async () => {
    if (!surveyToDelete) return;

    try {
      await axios.delete(
        `https://survey-be-5d9v.onrender.com/api/survey/delete-survey/${surveyToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );
      setSurveys((prevSurveys) =>
        prevSurveys.filter((survey) => survey._id !== surveyToDelete)
      );
      toast.success("Survey deleted successfully.");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting survey");
    }
  };

  const toggleDropdown = (surveyId) => {
    
    if (dropdownVisibleId === surveyId) {
      setDropdownVisibleId(null); 
    } else {
      setDropdownVisibleId(surveyId); 
    }
  };

  return (
    <div className="p-4 pb-5 mb-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Created Surveys
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {surveys.length === 0 ? (
        <div className="text-gray-500 text-center">No surveys available.</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {surveys.map((survey) => (
            <div
              key={survey._id}
              className="relative p-4 text-center border border-gray-300 rounded-lg shadow-lg flex flex-col justify-between items-center bg-white w-64 h-44 transition-transform transform hover:scale-105"
              onClick={() => handleSurveyClick(survey._id)}
            >
              <div className="flex-col flex items-center justify-center mb-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {survey.title}
                </h2>
                <p className="text-gray-600 truncate">{survey.description}</p>
              </div>

              <div className="absolute top-2 right-2">
                <button
                  className="focus:outline-none p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(survey._id);
                  }}
                >
                  <FaEllipsisV className="text-gray-600" size={24} />
                </button>
                {dropdownVisibleId === survey._id && (
                  <div className="absolute right-0 mt-1 bg-white border border-gray-300 shadow-md rounded-md z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(survey._id);
                      }}
                      className="block px-4 py-2 text-center text-blue-500 hover:bg-blue-100 transition duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenResponse(survey._id); // Add responses option
                      }}
                      className="block px-4 py-2 text-center text-green-500 hover:bg-green-100 transition duration-150"
                    >
                      Responses
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(survey._id);
                      }}
                      className="block px-4 py-2 text-center text-red-500 hover:bg-red-100 transition duration-150"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150">
                  View Survey
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete"
        className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-80 text-white rounded"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this survey?</p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserCreatedSurvey;
