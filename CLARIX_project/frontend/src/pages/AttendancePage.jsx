import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import './AttendancePage.css';

export default function AttendancePage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [records, setRecords] = useState([]);
  const [studentStats, setStudentStats] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ date: new Date().toISOString().split('T')[0], topic: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/auth/classrooms/').then(r => { const d=r.data; setClasses(Array.isArray(d)?d:d.results||[]); if(r.data.length) setSelectedClass(r.data[0].id); }); }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    if (user.role === 'teacher') {
      api.get(`/attendance/sessions/?classroom=${selectedClass}`).then(r => setSessions(r.data)).finally(() => setLoading(false));
    } else {
      api.get(`/attendance/student/${selectedClass}/`).then(r => setStudentStats(r.data)).finally(() => setLoading(false));
    }
  }, [selectedClass, user.role]);

  const openSession = (session) => {
    setActiveSession(session);
    setRecords(session.records.map(r => ({ ...r })));
  };

  const setStatus = (studentId, status) => {
    setRecords(prev => prev.map(r => r.student === studentId ? { ...r, status } : r));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      await api.post(`/attendance/sessions/${activeSession.id}/mark/`, {
        records: records.map(r => ({ student: r.student, status: r.status }))
      });
      toast.success('Attendance saved!');
      const { data } = await api.get(`/attendance/sessions/?classroom=${selectedClass}`);
      setSessions(data);
      setActiveSession(null);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const createSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance/sessions/', { ...newForm, classroom: selectedClass });
      toast.success('Session created!');
      setShowNew(false);
      const { data } = await api.get(`/attendance/sessions/?classroom=${selectedClass}`);
      setSessions(data);
    } catch (err) { toast.error(err.response?.data?.non_field_errors?.[0] || 'Session already exists for this date'); }
  };

  const statusColor = { present: 'success', absent: 'danger', late: 'warning' };

  return (
    <div className="fade-in">
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-sub">{user.role === 'teacher' ? 'Mark and manage attendance sessions' : 'View your attendance records'}</p>
        </div>
        {user.role === 'teacher' && <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Session</button>}
      </div>

      <div className="form-group" style={{maxWidth:300,marginBottom:24}}>
        <label className="form-label">Select Class</label>
        <select className="form-input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.subject})</option>)}
        </select>
      </div>

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <h3>New Attendance Session</h3>
            <form onSubmit={createSession} style={{marginTop:16,display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={newForm.date} onChange={e=>setNewForm(f=>({...f,date:e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Topic (optional)</label>
                <input className="form-input" value={newForm.topic} onChange={e=>setNewForm(f=>({...f,topic:e.target.value}))} placeholder="e.g. Binary Trees" />
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary">Create</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student stats view */}
      {user.role === 'student' && studentStats && (
        <div>
          <div className="att-stats">
            <div className="att-stat-card">
              <div className="att-stat-num" style={{color:'var(--primary)'}}>{studentStats.percentage}%</div>
              <div className="att-stat-label">Attendance Rate</div>
              <div className="att-progress">
                <div className="att-progress-bar" style={{width:`${studentStats.percentage}%`,background: studentStats.percentage>=75?'var(--success)':'var(--danger)'}}/>
              </div>
            </div>
            <div className="att-stat-card"><div className="att-stat-num">{studentStats.total}</div><div className="att-stat-label">Total Classes</div></div>
            <div className="att-stat-card"><div className="att-stat-num" style={{color:'var(--success)'}}>{studentStats.present}</div><div className="att-stat-label">Present</div></div>
            <div className="att-stat-card"><div className="att-stat-num" style={{color:'var(--danger)'}}>{studentStats.absent}</div><div className="att-stat-label">Absent</div></div>
          </div>
          {studentStats.percentage < 75 && <div className="att-warning card">⚠️ Your attendance is below 75%. Please attend more classes.</div>}
          <h3 style={{marginBottom:12,fontWeight:700}}>Session History</h3>
          <div className="sessions-list">
            {studentStats.records?.map((r, i) => (
              <div key={i} className="session-row card">
                <div><div className="session-date">{format(new Date(r.date), 'dd MMM yyyy')}</div><div className="session-topic">{r.topic || 'No topic'}</div></div>
                <span className={`badge badge-${statusColor[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher sessions view */}
      {user.role === 'teacher' && !activeSession && (
        <div>
          {loading ? <div style={{display:'flex',justifyContent:'center',padding:48}}><div className="spinner"/></div>
          : sessions.length === 0 ? (
            <div className="empty-state card"><div className="empty-icon">📋</div><h3>No sessions yet</h3><p>Create your first attendance session</p></div>
          ) : (
            <div className="sessions-list">
              {sessions.map(s => (
                <div key={s.id} className="session-row card session-row-teacher" onClick={() => openSession(s)}>
                  <div>
                    <div className="session-date">{format(new Date(s.date), 'dd MMM yyyy')}</div>
                    <div className="session-topic">{s.topic || 'No topic'}</div>
                  </div>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <span className="badge badge-success">✓ {s.present_count} present</span>
                    <span className="badge badge-danger">✗ {s.absent_count} absent</span>
                    <span style={{fontSize:13,color:'var(--text-muted)'}}>→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mark Attendance view */}
      {user.role === 'teacher' && activeSession && (
        <div className="mark-attendance fade-in">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:10}}>
            <div>
              <h3 style={{fontWeight:800}}>{format(new Date(activeSession.date), 'dd MMM yyyy')}</h3>
              <p style={{fontSize:13,color:'var(--text-muted)'}}>{activeSession.topic}</p>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-secondary" onClick={() => setActiveSession(null)}>← Back</button>
              <button className="btn btn-primary" onClick={saveAttendance} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
            </div>
          </div>
          <div className="mark-all-btns">
            <button className="btn btn-sm" style={{background:'#D1FAE5',color:'#065F46'}} onClick={() => setRecords(r=>r.map(s=>({...s,status:'present'})))}>✓ All Present</button>
            <button className="btn btn-sm" style={{background:'#FEE2E2',color:'#991B1B'}} onClick={() => setRecords(r=>r.map(s=>({...s,status:'absent'})))}>✗ All Absent</button>
          </div>
          <div className="student-records">
            {records.map(r => (
              <div key={r.student} className="student-record card">
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div className="avatar avatar-md" style={{background:'var(--primary)',fontSize:14}}>{getInitials(r.student_detail)}</div>
                  <div>
                    <div style={{fontWeight:600}}>{r.student_detail?.first_name} {r.student_detail?.last_name}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{r.student_detail?.student_id}</div>
                  </div>
                </div>
                <div className="status-btns">
                  {['present','absent','late'].map(s => (
                    <button key={s} className={`status-btn status-${s} ${r.status===s?'status-active':''}`} onClick={() => setStatus(r.student, s)}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getInitials(user) {
  if (!user) return '?';
  return ((user.first_name?.[0]||'')+(user.last_name?.[0]||'')).toUpperCase();
}
