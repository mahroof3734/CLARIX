import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { getInitials, getColor } from '../components/layout/Sidebar.jsx';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    department: user?.department || '',
    student_id: user?.student_id || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/auth/profile/', form);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fade-in profile-page">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-sub">Manage your account details</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card card">
          <div className="profile-avatar-wrap">
            <div className="avatar" style={{
              background: getColor(user?.first_name),
              width: 90, height: 90, fontSize: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, borderRadius: '50%',
            }}>
              {getInitials((user?.first_name || '') + ' ' + (user?.last_name || ''))}
            </div>
          </div>
          <h2 className="profile-name">{user?.first_name} {user?.last_name}</h2>
          <span className={`badge ${user?.role === 'teacher' ? 'badge-primary' : 'badge-success'}`} style={{fontSize:13}}>
            {user?.role === 'teacher' ? '👩‍🏫 Teacher' : '👨‍🎓 Student'}
          </span>
          <div className="profile-info-list">
            <div className="profile-info-item"><span>📧</span><span>{user?.email}</span></div>
            <div className="profile-info-item"><span>🏛️</span><span>{user?.department || '—'}</span></div>
            {user?.role === 'student' && <div className="profile-info-item"><span>🆔</span><span>{user?.student_id || '—'}</span></div>}
            <div className="profile-info-item"><span>👤</span><span>@{user?.username}</span></div>
          </div>
        </div>

        <div className="profile-edit card">
          <h3>Edit Profile</h3>
          <form onSubmit={handleSave} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" value={form.first_name} onChange={e => set('first_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={form.last_name} onChange={e => set('last_name', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={form.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Computer Science" />
            </div>
            {user?.role === 'student' && (
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input className="form-input" value={form.student_id} onChange={e => set('student_id', e.target.value)} placeholder="e.g. CS2021001" />
              </div>
            )}
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
