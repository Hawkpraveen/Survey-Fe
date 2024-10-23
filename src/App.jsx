import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Navbar from "./Components/Navbar";
import AdminRoute from "./Components/AdminRoute";
import AddSurvey from "./Pages/AddSurvey";
import CreateSurvey from "./Components/CreateSurvey";
import SurveyDetail from "./Components/SurveyDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContractSampleSurvey from "./Components/ContractSampleSurvey";
import PartyInvitation from "./Components/PartyInvitation";
import CustomerSatisfactionSurvey from "./Components/CustomerSatisfactionSurvey";
import EditSurvey from "./Components/EditSurvey";
import UserTakenSurvey from "./Components/UserTakenSurvey";
import ResponsesOfSurvey from "./Components/ResponsesOfSurvey";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/survey/:surveyId" element={<SurveyDetail />} />
          <Route path="/taken-surveys" element={<UserTakenSurvey />} />

          <Route path="/admin" element={<AdminRoute />}>
            <Route path="add-survey" element={<AddSurvey />} />
            <Route path="create-survey" element={<CreateSurvey />} />
            <Route path="edit-survey/:surveyId" element={<EditSurvey />} />
            <Route path="contract-sample-survey"  element={<ContractSampleSurvey />}/>
            <Route path="party-invitation-sample-survey" element={<PartyInvitation />} />
            <Route path="customer-satisfaction-sample-survey" element={<CustomerSatisfactionSurvey />}  />
            <Route path="survey/:surveyId/responses" element={<ResponsesOfSurvey />} />
          </Route>

          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
