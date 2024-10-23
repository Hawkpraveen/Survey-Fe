import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentUser } from "../Redux/Slice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleNavigateToHome = () => {
    navigate("/");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearCurrentUser());
    navigate("/");
  };

  return (
    <nav className="bg-neutral-900 p-4 ">
      <div className="flex items-center justify-between">
        {/* Site Name */}
        <h1
          className="text-white text-2xl cursor-pointer"
          onClick={handleNavigateToHome}
        >
          SurveySite
        </h1>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          {currentUser ? (
            currentUser.user.isAdmin ? (
              <>
                <button
                  className="text-white hover:text-gray-300"
                  onClick={() => navigate("/admin/add-survey")}
                >
                  Surveys
                </button>

                <button className="text-white " onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-white hover:text-gray-300"
                  onClick={() => navigate("/taken-surveys")}
                >
                  Taken Surveys
                </button>
                <button className="text-white " onClick={handleLogout}>
                  Logout
                </button>
              </>
            )
          ) : (
            <>
              <button
                className="text-white hover:text-gray-300"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="text-white hover:text-gray-300"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
