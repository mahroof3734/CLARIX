import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/classrooms/')
      .then(r => {
        // Handle both array and paginated response
        const data = r.data;
        if (Array.isArray(data)) {
          setClasses(data);
        } else if (data.results) {
          setClasses(data.results);
        } else {
          setClasses([]);
        }
      })
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  const colors = ['#4F46E5','#0EA5E9','#10B981','#F59E0B','#EF4444','#8B5CF6'];
  const getColor = (i) => colors[i % colors.length];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="dash-welcome">
          <h1>Good {getGreeting()}, {user?.first_name}! 👋</h1>
          <p className="page-sub">{user?.role === 'teacher' ? "Here's your teaching overview" : "Here's your learning overview"}</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#EEF2FF'}}>🎓</div>
          <div>
            <div className="stat-num">{classes.length}</div>
            <div className="stat-label">{user?.role === 'teacher' ? 'Classes Teaching' : 'Enrolled Classes'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#D1FAE5'}}>👥</div>
          <div>
            <div className="stat-num">{classes.reduce((a, c) => a + (c.student_count || 0), 0)}</div>
            <div className="stat-label">{user?.role === 'teacher' ? 'Total Students' : 'Classmates'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#FEF3C7'}}>✅</div>
          <div>
            <div className="stat-num">{classes.length}</div>
            <div className="stat-label">Active Classes</div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Your Classes</h2>
        <Link to="/classes" className="btn btn-secondary btn-sm">View All →</Link>
      </div>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:48}}><div className="spinner"/></div>
      ) : classes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🎓</div>
          <h3>{user?.role === 'teacher' ? 'No classes yet' : 'Not enrolled in any class'}</h3>
          <p>{user?.role === 'teacher' ? 'Create your first class to get started' : 'Join a class using a class code'}</p>
          <Link to="/classes" className="btn btn-primary" style={{marginTop:16}}>
            {user?.role === 'teacher' ? 'Create Class' : 'Join Class'}
          </Link>
        </div>
      ) : (
        <div className="classes-grid">
          {classes.map((cls, i) => (
            <Link key={cls.id} to={`/classes`} className="class-card card">
              <div className="class-banner" style={{background: getColor(i)}} />
              <div className="class-body">
                <div className="class-subject badge badge-primary">{cls.subject}</div>
                <h3 className="class-name">{cls.name}</h3>
                <p className="class-teacher">{cls.teacher_name}</p>
                <div className="class-meta">
                  <span>👥 {cls.student_count} students</span>
                  <span className="class-code">#{cls.class_code}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="quick-links">
        <h2 className="section-title" style={{marginBottom:14}}>Quick Actions</h2>
        <div className="grid-4">
          <Link to="/chat" className="quick-link card"><span>💬</span><span>Open Chat</span></Link>
          <Link to="/attendance" className="quick-link card"><span>✅</span><span>{user?.role==='teacher'?'Mark Attendance':'View Attendance'}</span></Link>
          <Link to="/notes" className="quick-link card"><span>📚</span><span>{user?.role==='teacher'?'Upload Notes':'Browse Notes'}</span></Link>
          <Link to="/classes" className="quick-link card"><span>🎓</span><span>{user?.role==='teacher'?'Create Class':'Join Class'}</span></Link>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
