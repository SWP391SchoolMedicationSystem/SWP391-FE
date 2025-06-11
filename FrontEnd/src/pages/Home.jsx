import React from "react";
import Header from "../components/layout/Header";
import DoctorHomePageImage from "../assets/images/Doctor-HomePage.png";
import "../css/HomePage.css";
import { Button } from "@mui/material"; 

export default function Home() {
  return (
    <div className="home-page">
      <Header />

      <section className="hero-section">
        <div className="hero-text">
          <h1>
            School Medical <br />{" "}
            <span className="highlight">Management System</span>
          </h1>
          <p>
            A comprehensive solution for managing student health, vaccinations,
            and medical monitoring in schools
          </p>
          <Button
            variant="contained"
            sx={{
              borderRadius: "50px",
              px: 3,
              color: "white",
              background: "linear-gradient(to right, #56D0DB, #2D77C1)",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            Learn More
          </Button>        </div>
        <div className="hero-image">
          <img src={DoctorHomePageImage} alt="Medical Team" />
        </div>
      </section>

      <section className="system-overview">
        <h2>System Overview</h2>
        <p>Efficient and comprehensive student health management</p>

        <div className="overview-cards">
          <div className="card">
            <h3>Total Students</h3>
            <p className="number">1,245</p>
            <p className="note">+15 this month</p>
          </div>
          <div className="card">
            <h3>Health Events</h3>
            <p className="number">24</p>
            <p className="note">+2 this week</p>
          </div>
          <div className="card">
            <h3>Vaccinations</h3>
            <p className="number">85%</p>
            <p className="note">Completion rate</p>
          </div>
          <div className="card">
            <h3>Health Checkups</h3>
            <p className="number">12</p>
            <p className="note">Appointments today</p>
          </div>
        </div>
      </section>
    </div>
  );
}
