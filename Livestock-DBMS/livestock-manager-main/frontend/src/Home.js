import React from "react";
import { ThumbsUp, LineChart, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "./Home.css";

export default function HomePage() {
  const navigate = useNavigate(); // Initialize navigate

  const handleGetStarted = () => {
    navigate("/signup"); // Navigate to the /signup route
  };

  return (
    <div className="home-page">
      <div className="card">
        {/* Header Section */}
        <h1 className="title">Welcome to HerdWise</h1>
        <p className="subtitle">Your friendly farm management companion</p>

        {/* Features Section */}
        <div className="features">
          {/* Feature 1: Easy to Use */}
          <div className="feature">
            <ThumbsUp className="icon yellow-icon" />
            <h2 className="feature-title">Easy to Use</h2>
            <p className="feature-description">
              Manage your farm with just a few clicks
            </p>
          </div>

          {/* Feature 2: Comprehensive */}
          <div className="feature">
            <LineChart className="icon blue-icon" />
            <h2 className="feature-title">Comprehensive</h2>
            <p className="feature-description">
              Track animals, health, breeding, and more
            </p>
          </div>

          {/* Feature 3: Insightful */}
          <div className="feature">
            <Flame className="icon red-icon" />
            <h2 className="feature-title">Insightful</h2>
            <p className="feature-description">
              Get valuable insights to improve your farm
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <button className="get-started-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
}
