# 🚀 Team Task Manager (MERN Stack)

A professional, full-stack task management application designed for teams to streamline project workflows. This platform features a robust Role-Based Access Control (RBAC) system, allowing Admins to oversee projects while members manage their individual assignments.

---

## ✨ Features

### 🔐 Security & Authentication
* **JWT Authentication:** Stateless security using JSON Web Tokens.
* **Role-Based Access:** Distinct dashboards and permissions for **Admins** and **Members**.
* **Secure Password Hashing:** User credentials encrypted using BcryptJS.

### 📊 Project & Task Management
* **Admin Dashboard:** Create projects, add members, and assign tasks with specific due dates.
* **Member Dashboard:** View personal task lists and update progress in real-time.
* **Auto-Sync:** Assigning a task automatically adds the user to the project's member list using MongoDB's `$addToSet`.
* **Status Tracking:** Manage task lifecycles through "To-Do", "In-Progress", and "Completed" stages.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Axios, Context API
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Cloud)
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## 📂 Project Structure

```text
TEAM-TASK-MANAGER/
├── backend/
│   ├── config/         # Database connection (Mongoose)
│   ├── controllers/    # Logical functions for Auth, Projects, and Tasks
│   ├── middleware/     # JWT verification & Admin route guarding
│   ├── models/         # MongoDB Schemas (User, Project, Task)
│   ├── routes/         # API Endpoints
│   └── server.js       # Main entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI elements
│   │   ├── context/    # Global Auth & State Management
│   │   ├── pages/      # View Routes (Dashboard, Login, Tasks)
│   │   └── App.jsx     # Main Routing logic
│   └── vercel.json     # Deployment routing configuration
└── README.md


Installation & Local Setup
1. Clone the Repository
Bash
git clone [https://github.com/YourUsername/TEAM-TASK-MANAGER.git](https://github.com/YourUsername/TEAM-TASK-MANAGER.git)
cd TEAM-TASK-MANAGER
2. Setup Backend
Bash
cd backend
npm install
Create a .env file in the backend directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
Run the server:

Bash
npm run dev
3. Setup Frontend
Bash
cd ../frontend
npm install
npm run dev
🌐 Deployment Configuration
Frontend (Vercel)
To prevent 404 NOT FOUND errors on page reloads, a vercel.json is included in the frontend root:

JSON
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
Backend (Render)
Root Directory: backend

Build Command: npm install

Start Command: node server.js
