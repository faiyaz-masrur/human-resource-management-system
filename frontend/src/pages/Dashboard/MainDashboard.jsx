// MainDashboard.jsx - Updated version
import React from 'react';
import LeaveCharts from './LeaveCharts'; 

const MainDashboard = () => {
  return (
    <div className="main-dashboard-container">
      {/* Leave Highlights section */}
      <div className="section-header">
        <h2>Leave Highlights</h2>
      </div>
      <div className="highlights-grid">
        <div className="highlight-card">
          <p className="card-title">On Leave Today</p>
          <span className="card-value">2</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">On Leave Tomorrow</p>
          <span className="card-value">5</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">Pending Leave Application</p>
          <span className="card-value">4</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">Upcoming Holiday</p>
          <span className="card-value">16 Dec 25</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
      </div>
      
      {/* Use the new LeaveCharts component */}
      <LeaveCharts />
      
      {/* Attendance Highlights section */}
      <div className="section-header">
        <h2>Attendance Highlights</h2>
      </div>
      <div className="highlights-grid">
        <div className="highlight-card">
          <p className="card-title">Present Today</p>
          <span className="card-value">50</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">Absent Today</p>
          <span className="card-value">2</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">Absent This Week</p>
          <span className="card-value">5</span>
          <span className="card-trend-up">4.50% &uarr;</span>
        </div>
        <div className="highlight-card">
          <p className="card-title">Absent This Month</p>
          <span className="card-value">10</span>
          <span className="card-trend-down">9.60% &darr;</span>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;