// src/components/PrivateRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';  // Ensure the path is correct

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user, loading, error] = useAuthState(auth);  // Check if user is authenticated

  if (loading) {
    return <p>Loading...</p>;  // You can replace this with a spinner or loader if you prefer
  }

  if (error) {
    console.error('Error in PrivateRoute:', error.message);
    return <p>Error loading authentication state</p>;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        return user ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" replace />  // Redirect to login if not authenticated
        );
      }}
    />
  );
};

export default PrivateRoute;
