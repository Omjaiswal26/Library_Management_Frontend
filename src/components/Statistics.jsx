import React, { useState, useEffect } from 'react';
import './Statistics.css'; // Import the CSS file for styling
import { FaUser, FaBook, FaClipboardList, FaCheckCircle } from 'react-icons/fa'; // Example icons

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    total_members: 0,
    active_members: 0,
    issued_books: 0,
    returned_books: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/statistics/');
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const data = [
    { number: statistics.total_members, label: 'Total Members', icon: <FaUser /> },
    { number: statistics.issued_books, label: 'Issued Books', icon: <FaBook /> },
    { number: statistics.active_members, label: 'Active Members', icon: <FaClipboardList /> },
    { number: statistics.returned_books, label: 'Books Returned', icon: <FaCheckCircle /> },
  ];

  return (
    <div className="statistics-container">
      {data.map((stat, index) => (
        <div className="statistics-card" key={index}>
          <div className="card-content">
            <div className="card-number">{stat.number}</div>
            <div className="card-label">{stat.label}</div>
          </div>
          <div className="card-icon">{stat.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
