// MainDashboard.jsx - (No changes made)
import React from 'react';

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
          <span className="card-value">5</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">On Leave Tomorrow</p>
          <span className="card-value">10</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">Pending Leave Application</p>
          <span className="card-value">345</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">Upcoming Holiday</p>
          <span className="card-value">26 Mar 25</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
      </div>
      
      {/* Leave Charts section */}
      <div className="charts-grid">
        <div className="chart-card">
          <p className="chart-title">Leave Taken</p>
          <div className="chart-placeholder bar-chart-placeholder">
            {/* A bar chart component would go here */}
          </div>
        </div>
        <div className="chart-card chart-card-legend-parent"> {/* Added class for potential mobile fix */}
          <p className="chart-title">Leave by Type</p>
          <div className="chart-and-legend"> {/* New wrapper for flex layout */}
            <div className="chart-placeholder pie-chart-placeholder">
              {/* A pie chart component would go here */}
            </div>
            <ul className="legend-list">
              <li><span className="legend-dot casual"></span>Casual <span className="legend-percent">52.1%</span></li>
              <li><span className="legend-dot sick"></span>Sick <span className="legend-percent">22.8%</span></li>
              <li><span className="legend-dot earned"></span>Earned <span className="legend-percent">13.9%</span></li>
              <li><span className="legend-dot other"></span>Other <span className="legend-percent">11.2%</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Attendance Highlights section */}
      <div className="section-header">
        <h2>Attendance Highlights</h2>
      </div>
      <div className="highlights-grid">
        <div className="highlight-card">
          <p className="card-title">Present Today</p>
          <span className="card-value">5</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">Absent Today</p>
          <span className="card-value">10</span>
          <a href="#" className="card-details">details &gt;</a>
        </div>
        <div className="highlight-card">
          <p className="card-title">Absent This Week</p>
          <span className="card-value">34</span>
          <span className="card-trend-up">4.50% &uarr;</span>
        </div>
        <div className="highlight-card">
          <p className="card-title">Absent This Month</p>
          <span className="card-value">345</span>
          <span className="card-trend-down">9.60% &darr;</span>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;