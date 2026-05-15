# 📖 Clarix — Class Room Management Platform
 
> A full-stack web application that brings teachers and students together through real-time chat, smart attendance tracking, and resource sharing — all in one place.
 
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
 
---
 
## 🖥️ Live Preview
 
| Login Page | Teacher Dashboard | Student Dashboard |
|---|---|---|
| ![login](https://github.com/mahroof3734/CLARIX/blob/main/sign_in.png) | ![dashboard](https://github.com/mahroof3734/CLARIX/blob/main/teacher_portal_dashboard.png) | ![dashboard](https://github.com/mahroof3734/CLARIX/blob/main/stdnt%20dashbrd.png) |
 
---
 
## 📌 Table of Contents
 
- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Demo Accounts](#-demo-accounts)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
---
 
## 🧠 About the Project
 
College students and teachers struggle with **scattered communication** — notes get lost in WhatsApp groups, attendance is taken on paper registers, and there's no single place to manage a classroom.
 
**Clarix** solves this by providing a unified platform where:
- 👩‍🏫 **Teachers** can create classes, mark attendance, upload notes, and chat with students
- 👨‍🎓 **Students** can join classes, view attendance stats, download materials, and message teachers
Built as a full-stack personal project to demonstrate real-world skills in backend API development, real-time communication, and modern frontend design.
 
---
 
## ✨ Features
 
### 👩‍🏫 Teacher Portal
| Feature | Description |
|---|---|
| 🎓 Classroom Management | Create classrooms with auto-generated 6-character join codes |
| ✅ Attendance Marking | Create sessions per date, mark each student Present / Absent / Late |
| 📚 Notes Upload | Upload PDFs, PPTs, docs with tags and descriptions |
| 💬 Real-time Chat | Send direct messages or broadcast to the whole class |
| 👤 Profile Management | Edit personal and department information |
 
### 👨‍🎓 Student Portal
| Feature | Description |
|---|---|
| 🔗 Join Classes | Enter a class code to instantly enrol |
| 📊 Attendance Dashboard | View attendance %, session history, and low-attendance warnings |
| 📥 Browse & Download Notes | Search materials by title or tag |
| 💬 Chat | Message teachers and classmates directly |
| 👤 Profile Management | Update personal details and student ID |
 
### 🔐 Authentication
- JWT-based login with auto-refresh tokens
- Role-based access control (Teacher / Student)
- Protected API routes and protected React pages
---
 
## 🛠️ Tech Stack
 
### Backend
| Technology | Purpose |
|---|---|
| Python 3.11 | Core language |
| Django 4.2 | Web framework |
| Django REST Framework | REST API |
| Django Channels | WebSocket / real-time chat |
| Simple JWT | JWT authentication |
| PostgreSQL | Production database |
| SQLite | Development database |
| Redis | Channel layer for WebSocket |
| Docker + Docker Compose | Containerization |
 
### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP client + interceptors |
| React Hot Toast | Notifications |
| CSS Variables | Theming and responsive design |
 
---
 
## 📁 Project Structure
 
```
clarix/
├── backend/                        # Django REST API
│   ├── config/                     # Settings, URLs, ASGI config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── asgi.py
│   ├── users/                      # Auth, Users, Classrooms
│   │   ├── models.py               # User, ClassRoom models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── chat/                       # Messaging + WebSocket
│   │   ├── models.py               # Message model
│   │   ├── consumers.py            # WebSocket consumer
│   │   ├── routing.py
│   │   └── views.py
│   ├── attendance/                 # Attendance sessions & records
│   │   ├── models.py
│   │   └── views.py
│   ├── notes/                      # File uploads & downloads
│   │   ├── models.py
│   │   └── views.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
│
├── frontend/                       # React SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios client + interceptors
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── components/
│   │   │   └── layout/             # Sidebar, Layout, Top bar
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ClassesPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
Make sure you have these installed:
- [Python 3.11+](https://python.org/downloads)
- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)
### Option 1 — Manual Setup (Recommended for Development)
 
**1. Clone the repository**
```bash
git clone https://github.com/yourusername/clarix.git
cd clarix
```
 
**2. Backend Setup**
```bash
cd backend
 
# Create and activate virtual environment
python -m venv venv
 
# Windows
venv\Scripts\activate
# Mac / Linux
source venv/bin/activate
 
# Install dependencies
pip install -r requirements.txt
 
# Apply database migrations
python manage.py migrate
 
# Seed demo data (creates demo accounts)
python manage.py seed_demo
 
# Start the Django server
python manage.py runserver
```
> API will be running at **http://localhost:8000**
 
**3. Frontend Setup** *(open a new terminal)*
```bash
cd frontend
 
# Install dependencies
npm install
 
# Start the React app
npm start
```
> App will open at **http://localhost:3000**
 
---
 

 
## 🌐 API Endpoints
 
### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register new user |
| `POST` | `/api/auth/login/` | Login and get JWT tokens |
| `GET/PUT` | `/api/auth/profile/` | View or update profile |
| `POST` | `/api/token/refresh/` | Refresh access token |
 
### Classrooms
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/auth/classrooms/` | List or create classrooms |
| `POST` | `/api/auth/classrooms/join/` | Join a class via code |
| `GET` | `/api/auth/users/` | List all users |
 
### Chat
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/chat/direct/{user_id}/` | Direct messages |
| `GET/POST` | `/api/chat/classroom/{class_id}/` | Class chat messages |
| `GET` | `/api/chat/unread/` | Get unread message count |
 
### Attendance
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/attendance/sessions/` | List or create sessions |
| `POST` | `/api/attendance/sessions/{id}/mark/` | Bulk mark attendance |
| `GET` | `/api/attendance/student/{class_id}/` | Student attendance stats |
 
### Notes
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/notes/` | List or upload notes |
| `GET/DELETE` | `/api/notes/{id}/` | View or delete a note |
 
### WebSocket
```
ws://localhost:8000/ws/chat/{room_name}/
```
Room name format:
- Direct chat: `direct_{user1_id}_{user2_id}` (sorted)
- Class chat: `class_{classroom_id}`
---
 
## 🔐 Demo Accounts
 
After running `python manage.py seed_demo`, use these accounts:
 
| Role | Username | Password |
|---|---|---|
| 👩‍🏫 Teacher | `teacher1` | `password123` |
| 👩‍🏫 Teacher | `teacher2` | `password123` |
| 👨‍🎓 Student | `student1` | `password123` |
| 👨‍🎓 Student | `student2` | `password123` |
| 👨‍🎓 Student | `student3` | `password123` |
 
**Demo Class Codes:** `CS301A` · `MA201B`
 
---
 
## 🔮 Future Enhancements
 
- [ ] 📹 Live video classes using WebRTC
- [ ] 🤖 AI-powered Q&A assistant trained on uploaded notes
- [ ] 📊 Analytics dashboard for attendance trends and engagement
- [ ] 📱 React Native mobile app with push notifications
- [ ] 📝 Online assignment submission and grading
- [ ] 🌐 Multi-institution support with admin hierarchy
---
 
