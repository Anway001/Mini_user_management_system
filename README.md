# Mini User Management System

A full-stack user management application with authentication, role-based access control, and admin functionalities for managing user accounts.

## 📋 Project Overview & Purpose

This application provides a complete user management solution featuring:

- **User Authentication** - Register, login, and logout with JWT-based authentication
- **Role-Based Access Control** - Separate user and admin roles with protected routes
- **Admin Dashboard** - View, activate, and deactivate user accounts with pagination
- **User Profile Management** - View and update profile information, change password
- **Account Status Control** - Admins can activate/deactivate user accounts

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT** | JSON Web Token authentication |
| **bcryptjs** | Password hashing |
| **Joi** | Request validation |
| **cookie-parser** | Cookie handling |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite** | Build tool and dev server |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and configure environment variables (see [Environment Variables](#environment-variables))

4. Start the development server:
   ```bash
   nodemon server.js
   ```
   
   The backend server will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8080) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |

### Frontend (`Frontend/src/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## 🚀 Deployment Instructions

### Backend Deployment

1. **Build for production:**
   ```bash
   cd Backend
   npm install --production
   ```

2. **Set environment variables** on your hosting platform (Heroku, Render, Railway, etc.)

3. **Start command:**
   ```bash
   node server.js
   ```

### Frontend Deployment

1. **Build for production:**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Deploy the `dist` folder** to any static hosting service (Vercel, Netlify, etc.)

3. **Update CORS origins** in `Backend/server.js` to allow your production frontend URL

### Deployment Checklist
- [ ] Set all environment variables on the hosting platform
- [ ] Update CORS configuration for production URLs
- [ ] Ensure MongoDB is accessible from the production server
- [ ] Set `secure: true` for cookies in production (HTTPS required)

---

## 📚 API Documentation

**Base URL:** `http://localhost:8080/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "Fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64abc123...",
    "email": "john@example.com",
    "Fullname": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1..."
}
```

**Error Response (400):**
```json
{
  "message": "User Already Exists"
}
```

---

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "64abc123...",
    "email": "john@example.com",
    "Fullname": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1..."
}
```

**Error Responses:**
- `401` - Invalid credentials
- `401` - User is Blocked by admin

---

#### Logout
```http
POST /api/auth/logout
```
**Headers:** Requires authentication cookie

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### User Endpoints

> **Note:** All user endpoints require authentication (JWT cookie)

#### Get User Profile
```http
GET /api/user/profile
```

**Success Response (200):**
```json
{
  "message": "User found",
  "user": {
    "_id": "64abc123...",
    "Fullname": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Update User Profile
```http
PATCH /api/user/profile
```

**Request Body:**
```json
{
  "Fullname": "John Updated",
  "email": "john.updated@example.com",
  "password": "currentPassword123"
}
```

**Success Response (200):**
```json
{
  "message": "User updated successfully"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

#### Change Password
```http
PATCH /api/user/changepassword
```

**Request Body:**
```json
{
  "oldpassword": "currentPassword123",
  "newpassword": "newSecurePassword456"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400` - All fields are required
- `400` - New password cannot be same as old password
- `401` - Invalid credentials

---

### Admin Endpoints

> **Note:** All admin endpoints require authentication + admin role + active status

#### Get All Users (Paginated)
```http
GET /api/admin/getAllusers?page=1&limit=10
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Users per page |

**Success Response (200):**
```json
{
  "message": "Users fetched successfully",
  "users": [
    {
      "_id": "64abc123...",
      "Fullname": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalUsers": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

---

#### Activate User
```http
PATCH /api/admin/users/:id/activate
```

**Success Response (200):**
```json
{
  "message": "User activated successfully"
}
```

**Error Response (404):**
```json
{
  "message": "User not found"
}
```

---

#### Deactivate User
```http
PATCH /api/admin/users/:id/deactivate
```

**Success Response (200):**
```json
{
  "message": "User deactivated successfully"
}
```

**Error Response (404):**
```json
{
  "message": "User not found"
}
```

---

## 📁 Project Structure

```
Mini User Management System/
├── Backend/
│   ├── Controllers/
│   │   ├── admin.Controller.js
│   │   ├── auth.Controller.js
│   │   └── user.Controller.js
│   ├── Middleware/
│   │   └── auth.Middleware.js
│   ├── Models/
│   │   └── user.Schema.js
│   ├── Routers/
│   │   ├── admin.Router.js
│   │   ├── auth.Router.js
│   │   └── user.Router.js
│   ├── db/
│   │   └── db.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── Frontend/
    ├── src/
    │   ├── Pages/
    │   ├── components/
    │   ├── assets/
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 📝 License

ISC License

## 👤 Author

Anway Kharsammble
