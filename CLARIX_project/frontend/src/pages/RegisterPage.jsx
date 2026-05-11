import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ username:'', email:'', password:'', first_name:'', last_name:'', role:'student', student_id:'', department:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch(err) {
      const msg = err.response?.data;
      toast.error(msg?.username?.[0] || msg?.email?.[0] || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="hero-icon">📖</div>
          <h1>Join EduConnect</h1>
          <p>Create your account and start connecting with your class today.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-sub">Fill in your details below</p>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{gap:12}}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" value={form.first_name} onChange={e=>set('first_name',e.target.value)} placeholder="First name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={form.last_name} onChange={e=>set('last_name',e.target.value)} placeholder="Last name" required />
              </div>
            </div>
            <div className="form-group" style={{marginTop:12}}>
              <label className="form-label">Username</label>
              <input className="form-input" value={form.username} onChange={e=>set('username',e.target.value)} placeholder="Choose username" required />
            </div>
            <div className="form-group" style={{marginTop:12}}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="your@email.com" required />
            </div>
            <div className="form-group" style={{marginTop:12}}>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Min 6 characters" required />
            </div>
            <div className="form-group" style={{marginTop:12}}>
              <label className="form-label">Role</label>
              <select className="form-input" value={form.role} onChange={e=>set('role',e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="grid-2" style={{gap:12,marginTop:12}}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-input" value={form.department} onChange={e=>set('department',e.target.value)} placeholder="e.g. Computer Science" />
              </div>
              {form.role === 'student' && (
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input className="form-input" value={form.student_id} onChange={e=>set('student_id',e.target.value)} placeholder="e.g. CS2024001" />
                </div>
              )}
            </div>
            <button className="btn btn-primary btn-full" style={{marginTop:18}} disabled={loading}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>
          <p style={{textAlign:'center',marginTop:14,fontSize:14,color:'var(--text-muted)'}}>
            Have an account? <Link to="/login" style={{color:'var(--primary)',fontWeight:600}}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
