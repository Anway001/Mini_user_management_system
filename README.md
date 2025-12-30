# Mini User Management System

## Project Overview
The Mini User Management System is a full-stack application designed to provide a secure and efficient way to manage user accounts. Its primary purpose is to allow users to register, log in, and manage their profiles, while providing administrators with a dashboard to monitor and control account statuses (activation/deactivation).

## Tech Stack
### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Token (JWT)
- bcryptjs
- Joi (for validation)
- cookie-parser

### Frontend
- React 19
- Vite
- React Router
- Axios

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB (local or Atlas) set up

### Backend Setup
1. Navigate to the `Backend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file and add the required variables.
4. Start the server: `npm run dev`.

### Frontend Setup
1. Navigate to the `Frontend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file in the `src` directory and add the required variables.
4. Start the application: `npm run dev`.

## Environment Variables

### Backend (.env)
- `PORT`: Port number for the server.
- `MONGODB_URI`: Connection string for the MongoDB database.
- `JWT_SECRET`: Secret key used for signing JWT tokens.

### Frontend (.env)
- `VITE_API_URL`: The base URL for the Backend API.

## Deployment Instructions
The application is configured for deployment on platforms like Vercel and Render.

### Deployment Steps
1. **Frontend:** Deployed on Vercel. Connect the repository, set the build command to `npm run build`, and the output directory to `dist`. Add the necessary environment variables.
2. **Backend:** Can be deployed on Render or Heroku. Connect the repository, set the start command to `node server.js`, and add the environment variables.
3. Update the CORS configuration in the Backend (`server.js`) to include the production Frontend URL.

## API Documentation

### Authentication
- `POST /api/auth/register`: Register a new user.
  - **Request:** `{ "Fullname": "Name", "email": "email@example.com", "password": "pass", "role": "user" }`
  - **Response (201):** `{ "message": "User registered successfully", "user": { ... } }`
- `POST /api/auth/login`: Login and receive a JWT in a cookie.
  - **Request:** `{ "email": "email@example.com", "password": "pass" }`
  - **Response (200):** `{ "message": "Login successful", "user": { ... } }`
- `POST /api/auth/logout`: Logout and clear the authentication cookie.

### User Management
- `GET /api/user/profile`: Retrieve the authenticated user's profile.
- `PATCH /api/user/profile`: Update user profile details.
  - **Request:** `{ "Fullname": "New Name", ... }`
- `PATCH /api/user/changepassword`: Update the user's password.
  - **Request:** `{ "oldpassword": "...", "newpassword": "..." }`

### Admin Operations
- `GET /api/admin/getAllusers`: Fetch a paginated list of all users.
- `PATCH /api/admin/users/:id/activate`: Activate a specific user account.
- `PATCH /api/admin/users/:id/deactivate`: Deactivate a specific user account.
