# HRMS Frontend

## Project Overview
The HRMS (Human Resource Management System) frontend is a React-based web application built with Vite, designed to provide a user-friendly interface for employees and HR users to manage HR-related tasks. It includes features like login, employee management, attendance tracking, leave requests, and payroll viewing, with role-based access for HR and employees. The frontend communicates with a backend API via REST endpoints, using a modern, responsive design with `react-hot-toast` for notifications.

## How to Install and Run Locally
### Prerequisites
- Node.js (v16+)
- npm or Yarn

### Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   VITE_API_URL=http://localhost:5000/api
   npm run dev

### API Endpoints Explanation

The frontend interacts with the following backend API endpoints (see backend README for details):

/api/auth/login: Authenticate users.
/api/employees: Manage employees (HR only).
/api/employees/me: Fetch logged-in user profile.
/api/attendance: Manage attendance (check-in/check-out).
/api/leaves: Apply for or manage leave requests.
/api/payroll: View payroll records.

### Login Credentials 
HR:
Email: hr@company.com
Password: admin123

### Deployment Link
https://hrms-frontend-d2wv.onrender.com

