import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid username or password');
    } finally { setLoading(false); }
  };

  const fillDemo = (role) => {
    if (role === 'teacher') setForm({ username: 'teacher1', password: 'password123' });
    else setForm({ username: 'student1', password: 'password123' });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="hero-icon">📖</div>
          <h1>EduConnect</h1>
          <p>The all-in-one platform for teachers and students. Attendance, notes, and real-time chat — all in one place.</p>
          <div className="hero-features">
            <div className="hero-feature"><span>✅</span> Smart Attendance Tracking</div>
            <div className="hero-feature"><span>💬</span> Real-time Messaging</div>
            <div className="hero-feature"><span>📚</span> Notes & Resources</div>
            <div className="hero-feature"><span>🎓</span> Classroom Management</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-sub">Enter your credentials to continue</p>
          <div className="demo-btns">
            <button className="btn btn-secondary btn-sm" onClick={() => fillDemo('teacher')}>👩‍🏫 Demo Teacher</button>
            <button className="btn btn-secondary btn-sm" onClick={() => fillDemo('student')}>👨‍🎓 Demo Student</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Enter username" required />
            </div>
            <div className="form-group" style={{marginTop:14}}>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter password" required />
            </div>
            <button className="btn btn-primary btn-full" style={{marginTop:20}} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p style={{textAlign:'center',marginTop:16,fontSize:14,color:'var(--text-muted)'}}>
            No account? <Link to="/register" style={{color:'var(--primary)',fontWeight:600}}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
