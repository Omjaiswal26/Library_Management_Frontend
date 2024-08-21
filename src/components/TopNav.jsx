import React from 'react';
import './TopNav.css';

const TopNav = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="topnav">
      <h3>Frappe</h3>
      <div className="topnav-search">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        
      </div>
      <div className="topnav-icons">
        <div className="icon">
          <i className="fas fa-bell"></i>
        </div>
        <div className="icon">
          <i className="fas fa-user"></i>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
