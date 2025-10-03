import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the real page components
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage'; // This is the updated line

// Placeholders for pages we haven't built yet
const LoginPage = () => <div className="flex items-center justify-center h-screen"><h1 className="text-4xl text-white">Login Page</h1></div>;
const DashboardPage = () => <div className="flex items-center justify-center h-screen"><h1 className="text-4xl text-white">Dashboard Page</h1></div>;
const EditorPage = () => <div className="flex items-center justify-center h-screen"><h1 className="text-4xl text-white">Editor Page</h1></div>;


function App() {
  return (
    // This main div with the gradient background will wrap our entire application
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900 to-black font-sans">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* This route now uses the real RegisterPage component */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* The :id part means we can have URLs like /editor/123xyz */}
          <Route path="/editor/:id" element={<EditorPage />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;

