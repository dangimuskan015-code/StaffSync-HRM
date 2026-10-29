# StaffSync – Modern Human Resource Management Solution

A deploy-ready MERN starter for a SkillWallet HRM project.

## Features
- React + Bootstrap responsive dashboard
- Employee directory with add/search functionality
- Attendance and leave overview
- Express REST API
- MongoDB/Mongoose employee model
- JWT login endpoint and bcrypt password hashing
- Role fields for Admin, Manager, Employee

## Run locally
### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Set `MONGO_URI` in `.env` to your MongoDB connection string.

### Frontend
```bash
cd client
npm install
npm run dev
```
The frontend expects the API at `http://localhost:5000/api` (override with `VITE_API_URL`).

## Demo / GitHub links
A real public demo URL and GitHub repository URL require publishing this project to your own GitHub account and deploying it (for example, Render + Vercel). The links are not generated/faked in this package. See `DEPLOYMENT.md`.
