import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Sidebar.css';

const NAV_TEACHER = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/classes', icon: '🎓', label: 'My Classes' },
  { to: '/chat', icon: '💬', label: 'Messages' },
  { to: '/attendance', icon: '✅', label: 'Attendance' },
  { to: '/notes', icon: '📚', label: 'Notes' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];
const NAV_STUDENT = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/classes', icon: '🎓', label: 'My Classes' },
  { to: '/chat', icon: '💬', label: 'Messages' },
  { to: '/attendance', icon: '✅', label: 'My Attendance' },
  { to: '/notes', icon: '📚', label: 'Notes' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

const colorMap = ['#4F46E5','#0EA5E9','#10B981','#F59E0B','#EF4444','#8B5CF6'];
export const getColor = (str) => colorMap[(str?.charCodeAt(0) || 0) % colorMap.length];
export const getInitials = (name) => name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??';

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = user?.role === 'teacher' ? NAV_TEACHER : NAV_STUDENT;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">📖</div>
          <div>
            <div className="brand-name">EduConnect</div>
            <div className="brand-sub">{user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar avatar-md" style={{background: getColor(user?.first_name), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, borderRadius:'50%', fontSize:14, flexShrink:0}}>
              {getInitials((user?.first_name||'') + ' ' + (user?.last_name||''))}
            </div>
            <div className="user-text">
              <div className="user-name">{user?.first_name} {user?.last_name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm btn-full" onClick={handleLogout} style={{marginTop:12}}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
