// client/src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Home = () => {
  return (
    <div className="full">
      <h1>Welcome to Vaccination Portal</h1>
      <p>
        Vaccination is a crucial step in preventing and controlling the spread of infectious diseases. It involves administering a vaccine to stimulate the immune system and provide protection against specific diseases.
      </p>
      <p>
        Vaccines have played a significant role in reducing the prevalence of many deadly diseases, saving lives, and contributing to overall public health. They are a safe and effective way to build immunity and safeguard individuals and communities.
      </p>
      <div className="button-container">
        <Link to="/register" className="button">Register</Link>
        <Link to='/login' className="button">Login</Link>
      </div>
      <p>
        Learn more about the importance of vaccination and how it helps in preventing diseases.
      </p>
    </div>
  );
};

export default Home;
