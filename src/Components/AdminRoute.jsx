
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  //console.log(currentUser);

  if (!currentUser || !currentUser.user.isAdmin) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default AdminRoute;
