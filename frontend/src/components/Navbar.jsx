import React, { useState } from "react";
import logo from '../assets/logo.jpeg';
import '../styles/navbar.css';
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoPowerSharp, IoMenu, IoClose } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleDash = () => { 
    Navigate('/dashboard'); 
    setShowMobileMenu(false); 
  };
  
  const handleClickTrans = () => { 
    Navigate('/transactions'); 
    setShowMobileMenu(false); 
  };
  
  const handleClickDaily = () => { 
    Navigate('/dailyexpenses'); 
    setShowMobileMenu(false); 
  };
  
  const handleInvest = () => { 
    Navigate('/investments'); 
    setShowMobileMenu(false); 
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    Navigate("/");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleAdd = () => {
    Navigate('/addtransactions');
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-left">
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <IoClose /> : <IoMenu />}
          </button>
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="brand-name">Letnext Fin Track</h1>
        </div>

        <div className={`nav-links ${showMobileMenu ? 'show' : ''}`}>
          <button 
            onClick={handleDash} 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={handleClickTrans} 
            className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}
          >
            Transactions
          </button>
          <button 
            onClick={handleClickDaily} 
            className={`nav-link ${location.pathname === '/dailyexpenses' ? 'active' : ''}`}
          >
            Daily Expenses
          </button>
          <button 
            onClick={handleInvest} 
            className={`nav-link ${location.pathname === '/investments' ? 'active' : ''}`}
          >
            Investments
          </button>
        </div>

        <div className="navbar-right">
          <button 
            className="icon-btn add-icon-btn" 
            onClick={handleAdd} 
            aria-label="Add Transaction"
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Add Transaction</span>
          </button>

          <button 
            onClick={handleLogout} 
            className="icon-btn logout-btn" 
            aria-label="Logout"
          >
            <IoPowerSharp />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {showMobileMenu && (
        <div 
          className="mobile-menu-overlay show" 
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="btn btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn btn-confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;