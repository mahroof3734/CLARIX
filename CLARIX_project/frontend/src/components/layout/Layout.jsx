import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';
import api from '../../api/axios.js';
import './Layout.css';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/classes': 'Classes',
  '/chat': 'Messages',
  '/attendance': 'Attendance',
  '/notes': 'Notes & Resources',
  '/profile': 'My Profile',
};

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'EduConnect';

  useEffect(() => {
    const fetchUnread = () => {
      api.get('/chat/unread/').then(r => setUnread(r.data.unread)).catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-area">
        <header className="top-bar">
          <button className="hamburger" onClick={() => setMobileOpen(true)}>☰</button>
          <h1 className="top-bar-title">{title}</h1>
          <div className="top-bar-right">
            {unread > 0 && (
              <Link to="/chat" className="unread-badge">
                💬 <span>{unread}</span>
              </Link>
            )}
            <Link to="/profile" className="top-bar-user">
              <div className="tb-avatar">
                {(user?.first_name?.[0] || '?').toUpperCase()}
              </div>
              <span className="tb-name">{user?.first_name}</span>
            </Link>
          </div>
        </header>
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
