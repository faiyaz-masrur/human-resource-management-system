// LeaveCharts.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const LeaveCharts = () => {
  // Data for bar chart (Leave Taken)
  const leaveTakenData = [
    { month: 'Jan', leaves: 12 },
    { month: 'Feb', leaves: 16 },
    { month: 'Mar', leaves: 24 },
    { month: 'Apr', leaves: 15 },
    { month: 'May', leaves: 10 },
    { month: 'Jun', leaves: 8 }
  ];

  // Data for pie chart (Leave by Type) - Using your preferred colors
  const leaveByTypeData = [
    { name: 'Casual', value: 52.1, color: '#8884d8' },
    { name: 'Sick', value: 22.8, color: '#82ca9d' },
    { name: 'Earned', value: 13.9, color: '#ffc658' },
    { name: 'Other', value: 11.2, color: '#ff8042' }
  ];

  return (
    <div className="charts-grid">
      {/* Leave Taken Bar Chart */}
      <div className="chart-card">
        <p className="chart-title">Leave Taken</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leaveTakenData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leaves" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leave by Type Pie Chart with Side-by-Side Legend */}
      <div className="chart-card chart-card-legend-parent">
        <p className="chart-title">Leave by Type</p>
        <div className="chart-and-legend">
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={leaveByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  // Removed the label property to remove percentages from inside pie chart
                >
                  {leaveByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend - Side by side */}
          <ul className="legend-list">
            {leaveByTypeData.map((item, index) => (
              <li key={item.name}>
                <span 
                  className="legend-dot" 
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.name} 
                <span className="legend-percent">{item.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaveCharts;