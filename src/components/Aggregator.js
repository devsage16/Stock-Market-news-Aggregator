// src/components/Aggregator.js
import React from "react";
import { auth } from "../firebaseConfig";

const Aggregator = () => {
  const user = auth.currentUser;

  return (
    <div>
      <h1>Welcome to the News Aggregator</h1>
      {user ? (
        <div>
          <h3>User Profile</h3>
          <p>Username: {user.displayName || "N/A"}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user logged in</p>
      )}
      {/* Your news aggregator code goes here */}
    </div>
  );
};

export default Aggregator;
