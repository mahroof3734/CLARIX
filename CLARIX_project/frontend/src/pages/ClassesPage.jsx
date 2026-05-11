import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ClassesPage.css';

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', subject: '' });
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClasses = () => {
    api.get('/auth/classrooms/').then(r => { const d = r.data; setClasses(Array.isArray(d) ? d : d.results || []); }).finally(() => setLoading(false));
  };
  useEffect(fetchClasses, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/classrooms/', createForm);
      setClasses(c => [data, ...c]);
      setShowCreate(false);
      setCreateForm({ name: '', subject: '' });
      toast.success(`Class created! Code: ${data.class_code}`);
    } catch { toast.error('Failed to create class'); }
    finally { setSubmitting(false); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/classrooms/join/', { class_code: joinCode });
      setClasses(c => [...c, data]);
      setShowJoin(false);
      setJoinCode('');
      toast.success(`Joined ${data.name}!`);
    } catch { toast.error('Invalid class code'); }
    finally { setSubmitting(false); }
  };

  const colors = ['#4F46E5','#0EA5E9','#10B981','#F59E0B','#EF4444','#8B5CF6'];

  return (
    <div className="fade-in">
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 className="page-title">{user?.role === 'teacher' ? 'My Classes' : 'Enrolled Classes'}</h1>
          <p className="page-sub">{user?.role === 'teacher' ? 'Manage your classrooms' : 'Your enrolled courses'}</p>
        </div>
        {user?.role === 'teacher' ? (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Create Class</button>
        ) : (
          <button className="btn btn-primary" onClick={() => setShowJoin(true)}>+ Join Class</button>
        )}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <h3>Create New Class</h3>
            <form onSubmit={handleCreate} style={{marginTop:16,display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-group">
                <label className="form-label">Class Name</label>
                <input className="form-input" value={createForm.name} onChange={e=>setCreateForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Data Structures" required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input className="form-input" value={createForm.subject} onChange={e=>setCreateForm(f=>({...f,subject:e.target.value}))} placeholder="e.g. CS301" required />
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="modal-overlay" onClick={() => setShowJoin(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <h3>Join a Class</h3>
            <p style={{fontSize:14,color:'var(--text-muted)',marginTop:4}}>Ask your teacher for the class code</p>
            <form onSubmit={handleJoin} style={{marginTop:16,display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-group">
                <label className="form-label">Class Code</label>
                <input className="form-input" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="e.g. CS301A" style={{fontFamily:'JetBrains Mono',letterSpacing:2}} required />
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Joining...' : 'Join'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowJoin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:48}}><div className="spinner"/></div>
      ) : classes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🎓</div>
          <h3>{user?.role === 'teacher' ? 'No classes yet' : 'Not enrolled anywhere'}</h3>
          <p>{user?.role === 'teacher' ? 'Create your first classroom' : 'Ask your teacher for a class code'}</p>
        </div>
      ) : (
        <div className="classes-list">
          {classes.map((cls, i) => (
            <div key={cls.id} className="class-row card">
              <div className="class-row-color" style={{background: colors[i % colors.length]}} />
              <div className="class-row-body">
                <div>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:4}}>
                    <span className="badge badge-primary">{cls.subject}</span>
                    <span className="class-code-badge">{cls.class_code}</span>
                  </div>
                  <h3 className="class-row-name">{cls.name}</h3>
                  <p style={{fontSize:13,color:'var(--text-muted)'}}>by {cls.teacher_name} • {cls.student_count} students</p>
                </div>
                <div className="class-row-actions">
                  <Link to={`/chat?class=${cls.id}`} className="btn btn-secondary btn-sm">💬 Chat</Link>
                  <Link to={`/attendance?class=${cls.id}`} className="btn btn-secondary btn-sm">✅ Attendance</Link>
                  <Link to={`/notes?class=${cls.id}`} className="btn btn-secondary btn-sm">📚 Notes</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
