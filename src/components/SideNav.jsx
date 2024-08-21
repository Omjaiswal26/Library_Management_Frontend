import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideNav.css';
import { LuLayoutDashboard } from "react-icons/lu";
import { PiBooks } from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import { LuBarChart3 } from "react-icons/lu";
import { LuBellRing } from "react-icons/lu";

import frappe from '../assets/frappe.png'

const SideNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="sidenav">
      <img src={frappe} alt='logo'/>
      <Link to='/' className={currentPath === '/' ? 'active' : ''}>
        <LuLayoutDashboard />
        <span>Home</span>
      </Link>
      <Link to="/books" className={currentPath === '/books' ? 'active' : ''}>
        <PiBooks />
        <span>Books</span>
      </Link>
      <Link to="/members" className={currentPath === '/members' ? 'active' : ''}>
        <GoPeople />
        <span>Members</span>
      </Link>
      <Link to="/dues" className={currentPath === '/dues' ? 'active' : ''}>
        <LuBellRing />
        <span>Dues</span>
      </Link>
      <Link to="/statistics" className={currentPath === '/statistics' ? 'active' : ''}>
        <LuBarChart3 />
        <span>Statistics</span>
      </Link>
    </div>
  );
};

export default SideNav;
