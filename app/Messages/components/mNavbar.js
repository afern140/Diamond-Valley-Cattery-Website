"use client";
import React from "react";
import { useUserAuth } from "../../_utils/auth-context";

const Navbar = () => {
  const { user } = useUserAuth();

  return (
    <div className="mNavbar">
      {user && (
        <div className="mUser">
          <img src={user.photoURL} alt="User" />
          <span>{user.displayName}</span>
        </div>
      )}
    </div>
  );
};

export default Navbar;

