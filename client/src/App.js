import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import BookSlot from './components/BookSlot';// Import the BookSlot component
import "./components/styles.css";
import Home from './components/Home';
import SignupPage from './components/SignupPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/bookslot" element={<BookSlot/>} />
        <Route path="/register" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path='/Home' element={<Home/>}/>
      </Routes>
    </Router>
  );
};

export default App;
