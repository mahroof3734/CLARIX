import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import './NotesPage.css';

const FILE_ICONS = { pdf: '📄', doc: '📝', docx: '📝', ppt: '📊', pptx: '📊', xls: '📈', xlsx: '📈', zip: '🗜️', mp4: '🎬', mp3: '🎵', jpg: '🖼️', jpeg: '🖼️', png: '🖼️' };
const getIcon = (name) => FILE_ICONS[name?.split('.').pop()?.toLowerCase()] || '📁';
const formatSize = (b) => b > 1048576 ? `${(b/1048576).toFixed(1)} MB` : b > 1024 ? `${(b/1024).toFixed(0)} KB` : `${b} B`;

export default function NotesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', tags: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { api.get('/auth/classrooms/').then(r => { const d=r.data; setClasses(Array.isArray(d)?d:d.results||[]); if(r.data.length) setSelectedClass(r.data[0].id); }); }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    api.get(`/notes/?classroom=${selectedClass}`).then(r => setNotes(r.data)).finally(() => setLoading(false));
  }, [selectedClass]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) { toast.error('Please select a file'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('title', uploadForm.title);
    fd.append('description', uploadForm.description);
    fd.append('tags', uploadForm.tags);
    fd.append('file', uploadForm.file);
    fd.append('classroom', selectedClass);
    try {
      const { data } = await api.post('/notes/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNotes(n => [data, ...n]);
      setShowUpload(false);
      setUploadForm({ title: '', description: '', tags: '', file: null });
      toast.success('Notes uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}/`);
      setNotes(n => n.filter(x => x.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.tags?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 className="page-title">Notes & Resources</h1>
          <p className="page-sub">{user.role === 'teacher' ? 'Upload study materials for students' : 'Access your class materials'}</p>
        </div>
        {user.role === 'teacher' && <button className="btn btn-primary" onClick={() => setShowUpload(true)}>+ Upload Notes</button>}
      </div>

      <div className="notes-controls">
        <select className="form-input" style={{maxWidth:260}} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.subject})</option>)}
        </select>
        <input className="form-input" style={{flex:1,maxWidth:360}} placeholder="🔍 Search notes..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <h3>Upload Study Material</h3>
            <form onSubmit={handleUpload} style={{marginTop:16,display:'flex',flexDirection:'column',gap:14}}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={uploadForm.title} onChange={e=>setUploadForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Week 3 - Linked Lists" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={uploadForm.description} onChange={e=>setUploadForm(f=>({...f,description:e.target.value}))} placeholder="Brief description..." style={{resize:'none'}} />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-input" value={uploadForm.tags} onChange={e=>setUploadForm(f=>({...f,tags:e.target.value}))} placeholder="e.g. arrays, sorting, algorithms" />
              </div>
              <div className="form-group">
                <label className="form-label">File</label>
                <div className="file-drop" onClick={() => document.getElementById('file-input').click()}>
                  {uploadForm.file ? (
                    <div>{getIcon(uploadForm.file.name)} <strong>{uploadForm.file.name}</strong> ({formatSize(uploadForm.file.size)})</div>
                  ) : (
                    <div><div style={{fontSize:28}}>📁</div><div>Click to select file</div><div style={{fontSize:12,color:'var(--text-muted)'}}>PDF, DOC, PPT, images and more</div></div>
                  )}
                </div>
                <input id="file-input" type="file" style={{display:'none'}} onChange={e=>setUploadForm(f=>({...f,file:e.target.files[0]}))} />
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:48}}><div className="spinner"/></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📚</div>
          <h3>{search ? 'No results found' : 'No notes uploaded yet'}</h3>
          <p>{user.role === 'teacher' ? 'Upload your first study material' : 'Your teacher will upload materials here'}</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filtered.map(note => (
            <div key={note.id} className="note-card card">
              <div className="note-icon">{getIcon(note.file_name)}</div>
              <div className="note-body">
                <h3 className="note-title">{note.title}</h3>
                {note.description && <p className="note-desc">{note.description}</p>}
                {note.tags && (
                  <div className="note-tags">
                    {note.tags.split(',').map(t => <span key={t} className="badge badge-gray">{t.trim()}</span>)}
                  </div>
                )}
                <div className="note-meta">
                  <span>by {note.uploaded_by_name}</span>
                  <span>{format(new Date(note.uploaded_at), 'dd MMM yyyy')}</span>
                  <span>⬇ {note.download_count}</span>
                </div>
              </div>
              <div className="note-actions">
                <a href={`http://localhost:8000${note.file}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" download>⬇ Download</a>
                {user.role === 'teacher' && <button className="btn btn-danger btn-sm" onClick={() => handleDelete(note.id)}>🗑</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
