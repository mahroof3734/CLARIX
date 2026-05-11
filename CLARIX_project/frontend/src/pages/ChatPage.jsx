import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { format } from 'date-fns';
import { getInitials, getColor } from '../components/layout/Sidebar.jsx';
import './ChatPage.css';

export default function ChatPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [active, setActive] = useState(null); // { type:'direct'|'class', id, name }
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    api.get('/auth/users/').then(r => { const d=r.data; setContacts(Array.isArray(d)?d:d.results||[]); });
    api.get('/auth/classrooms/').then(r => { const d=r.data; setClasses(Array.isArray(d)?d:d.results||[]); });
  }, []);

  const fetchMessages = useCallback(async (chat) => {
    setLoading(true);
    setMessages([]);
    try {
      const url = chat.type === 'direct' ? `/chat/direct/${chat.id}/` : `/chat/classroom/${chat.id}/`;
      const { data } = await api.get(url);
      setMessages(data);
    } finally { setLoading(false); }
  }, []);

  const openChat = (chat) => {
    setActive(chat);
    fetchMessages(chat);
    if (wsRef.current) wsRef.current.close();
    const roomName = chat.type === 'direct' ? `direct_${[user.id, chat.id].sort().join('_')}` : `class_${chat.id}`;
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'chat_message') {
        setMessages(prev => [...prev, {
          id: Date.now(), sender: msg.sender_id,
          sender_detail: { first_name: msg.sender_name },
          content: msg.message, timestamp: msg.timestamp,
        }]);
      }
    };
    wsRef.current = ws;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    const msgData = { content: text, ...(active.type === 'direct' ? { receiver: active.id } : { classroom: active.id }) };
    const { data } = await api.post(active.type === 'direct' ? `/chat/direct/${active.id}/` : `/chat/classroom/${active.id}/`, { content: text });
    setMessages(p => [...p, data]);
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({ message: text, sender_id: user.id, sender_name: `${user.first_name} ${user.last_name}`, timestamp: new Date().toISOString() }));
    }
    setText('');
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar card">
        <div className="chat-sidebar-header">
          <h2>Messages</h2>
        </div>
        <div className="chat-section-label">Class Chats</div>
        {classes.map(cls => (
          <button key={`c${cls.id}`} className={`chat-contact ${active?.type==='class'&&active?.id===cls.id?'active':''}`} onClick={()=>openChat({type:'class',id:cls.id,name:cls.name})}>
            <div className="avatar avatar-md" style={{background:'#4F46E5',fontSize:14}}>📚</div>
            <div className="contact-info">
              <div className="contact-name">{cls.name}</div>
              <div className="contact-sub">{cls.subject}</div>
            </div>
          </button>
        ))}
        <div className="chat-section-label">Direct Messages</div>
        {contacts.map(c => (
          <button key={`d${c.id}`} className={`chat-contact ${active?.type==='direct'&&active?.id===c.id?'active':''}`} onClick={()=>openChat({type:'direct',id:c.id,name:`${c.first_name} ${c.last_name}`})}>
            <div className="avatar avatar-md" style={{background:getColor(c.first_name)}}>{getInitials(c.first_name+' '+c.last_name)}</div>
            <div className="contact-info">
              <div className="contact-name">{c.first_name} {c.last_name}</div>
              <div className="contact-sub">{c.role}</div>
            </div>
          </button>
        ))}
      </aside>

      <div className="chat-main card">
        {!active ? (
          <div className="chat-empty">
            <span>💬</span>
            <h3>Select a conversation</h3>
            <p>Choose a class or person to start chatting</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="avatar avatar-md" style={{background: active.type==='class'?'#4F46E5':getColor(active.name)}}>{active.type==='class'?'📚':getInitials(active.name)}</div>
              <div>
                <div className="chat-header-name">{active.name}</div>
                <div className="chat-header-sub">{active.type === 'class' ? 'Class Chat' : 'Direct Message'}</div>
              </div>
            </div>

            <div className="chat-messages">
              {loading && <div style={{display:'flex',justifyContent:'center',padding:32}}><div className="spinner"/></div>}
              {messages.map((msg, i) => {
                const isMe = msg.sender === user.id || msg.sender_detail?.id === user.id;
                const showAvatar = !isMe && (i === 0 || messages[i-1]?.sender !== msg.sender);
                return (
                  <div key={msg.id} className={`msg-row ${isMe ? 'msg-me' : 'msg-other'}`}>
                    {!isMe && <div className="avatar avatar-sm" style={{background:getColor(msg.sender_detail?.first_name||''),alignSelf:'flex-end'}}>{getInitials((msg.sender_detail?.first_name||'?')+' '+(msg.sender_detail?.last_name||''))}</div>}
                    <div>
                      {!isMe && showAvatar && <div className="msg-sender-name">{msg.sender_detail?.first_name} {msg.sender_detail?.last_name}</div>}
                      <div className={`msg-bubble ${isMe?'bubble-me':'bubble-other'}`}>{msg.content}</div>
                      <div className="msg-time">{msg.timestamp ? format(new Date(msg.timestamp),'h:mm a') : ''}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form className="chat-input-bar" onSubmit={sendMessage}>
              <input className="form-input chat-input" value={text} onChange={e=>setText(e.target.value)} placeholder={`Message ${active.name}...`} />
              <button className="btn btn-primary" type="submit" disabled={!text.trim()}>Send ↑</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
