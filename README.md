# Carrier Portal

A platform connecting students with alumni for career guidance and opportunities.

## Tech Stack
- **Frontend:** React.js + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT-based
- **Hosting:** Vercel (frontend), Render (backend)

## Structure
- `/client` — React frontend
- `/server` — Node.js backend

---

## Getting Started

### 1. Backend
```
cd server
npm install
npm run dev
```

### 2. Frontend
```
cd client
npm install
npm start
```

---

## Database Schema
**Users**
- id (primary key)
- name
- email
- password (hashed)
- role (student/alumni)
- batch_year
- branch
- profile_picture
- linkedin_url
- current_position
- location
- messages (for internal chat)

---

## Features
- Student/alumni directory by batch and branch
- Secure JWT authentication
- Internal chat/messages
- Alumni profiles with LinkedIn, position, etc.

---

## Deployment
- Frontend: Vercel
- Backend: Render

---

## Next Steps
- Implement backend API endpoints
- Connect frontend to backend
- Polish UI with TailwindCSS
#   R e M I T  
 