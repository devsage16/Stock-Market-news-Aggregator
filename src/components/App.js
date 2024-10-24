// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';          // Home component with news fetching functionality
import Signup from './components/Signup';      // Signup component for user registration
import Login from './components/Login';        // Login component for user authentication
import Favorites from './components/Favorites'; // Favorites component to display favorite articles
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute to secure routes for authenticated users

const App = () => {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/" component={Home} />         {/* Home Page */}
        <Route path="/signup" component={Signup} />       {/* Signup Page */}
        <Route path="/login" component={Login} />         {/* Login Page */}

        {/* Protected Route */}
        <PrivateRoute path="/favorites" component={Favorites} />  {/* Only accessible if the user is authenticated */}
      </Switch>
    </Router>
  );
};

export default App;
