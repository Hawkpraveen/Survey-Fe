import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

import UserCreatedSurvey from "../Components/UserCreatedSurvey";

const AddSurvey = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleNavigate = () => {
    navigate("/admin/create-survey");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSurveyNavigate = () => {
    navigate("/admin/contract-sample-survey");
  };
  const handlePartyNavigate = () => {
    navigate("/admin/party-invitation-sample-survey");
  };
  const handleCustomerNavigate = () => {
    navigate("/admin/customer-satisfaction-sample-survey");
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <div className="mb-4 md:w-1/3 w-full">
        <input
          type="text"
          placeholder="Search surveys..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
      </div>
      <div className="flex flex-col md:flex-row items-center p-3 gap-6 md:gap-4 justify-center space-x-4 w-full max-w-3xl mb-4 ">
        <div className="flex flex-col ml-3 items-center justify-center bg-neutral-100 shadow-lg rounded-lg w-44 h-40 cursor-pointer md:transition duration-300 hover:shadow-xl md:transform md:hover:-translate-y-1">
          <button
            onClick={handleNavigate}
            className="flex items-center bg-red-500 text-white text-md px-4 py-2 rounded transition duration-300 hover:bg-green-600"
          >
            <FaPlusCircle className="mr-2" />
            Create Survey
          </button>
        </div>

        <div
          className="flex flex-col items-center justify-center bg-neutral-100 shadow-lg rounded-lg w-44 h-40 cursor-pointer transition duration-300 hover:shadow-xl transform hover:-translate-y-1"
          onClick={handleSurveyNavigate}
        >
          <h2 className="font-semibold text-gray-700 text-ellipsis p-2 text-center">
            Contract Sample Survey
          </h2>
        </div>
        <div
          className="flex flex-col items-center justify-center bg-neutral-100 shadow-lg rounded-lg w-44 h-40 cursor-pointer transition duration-300 hover:shadow-xl transform hover:-translate-y-1"
          onClick={handlePartyNavigate}
        >
          <h2 className="font-semibold text-gray-700 text-ellipsis p-2 text-center">
            Party Invitation Sample Survey
          </h2>
        </div>

        <div
          className="flex flex-col items-center justify-center bg-neutral-100 shadow-lg rounded-lg w-44 h-40 cursor-pointer transition duration-300 hover:shadow-xl transform hover:-translate-y-1"
          onClick={handleCustomerNavigate}
        >
          <h2 className="font-semibold text-gray-700 text-ellipsis p-2 text-center">
            Customer Satisfaction Sample Survey
          </h2>
        </div>
      </div>

      <hr className="border-t-2 border-gray-300 w-full max-w-3xl my-4 pb-4" />
      <div className="bg-neutral-100 rounded-lg p-4 w-full shadow-lg text-center ">
        <UserCreatedSurvey
          searchTerm={searchTerm}
          onSurveyClick={handleSurveyNavigate}
        />
      </div>
    </div>
  );
};

export default AddSurvey;
