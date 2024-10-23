import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../Redux/Slice";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://survey-be-5d9v.onrender.com/api/users/login-user",
        {
          email,
          password,
        }
      );

      const data = response.data;

      sessionStorage.setItem("authToken", data.token);

      dispatch(setCurrentUser(data));

      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Error during login:", error);
    }
  };

  const handleNavigateToSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login into Survey Site
        </h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-800 hover:scale-105"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-md">Don't have an account?</p>
          <button
            type="button"
            onClick={handleNavigateToSignUp}
            className="text-blue-500 hover:scale-110"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
