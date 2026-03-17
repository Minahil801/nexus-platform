# Nexus Platform - Investor & Entrepreneur Collaboration

## 📋 Project Overview

A full-stack web application connecting investors and entrepreneurs with advanced features for collaboration, meetings, document management, and payments.

---

## ✅ Completed Features

### Week 1 - Authentication & Profiles
- ✅ JWT-based authentication
- ✅ User registration & login
- ✅ Role-based access (Investor/Entrepreneur)
- ✅ Profile management

### Week 2 - Collaboration & Documents
- ✅ Meeting scheduling system with conflict detection
- ✅ Video calling (WebRTC + Socket.IO)
- ✅ Document upload & sharing
- ✅ E-signature functionality

### Week 3 - Payments & Security
- ✅ Payment simulation (Deposit, Withdraw, Transfer)
- ✅ Transaction history
- ✅ Input validation & sanitization
- ✅ Password hashing (bcrypt)
- ✅ Secure JWT tokens

---

## 🛠️ Tech Stack

**Frontend:** React + TypeScript + Vite  
**Backend:** Node.js + Express  
**Database:** MongoDB (Local)  
**Real-time:** Socket.IO  
**Authentication:** JWT + bcrypt  
**File Upload:** Multer  
**Validation:** Validator.js

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Git

### Backend Setup
```bash
cd backend
npm install

# Create .env file
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your_super_secret_jwt_key_nexus_2026

npm run dev
```

### Frontend Setup
```bash
npm install
npm run dev
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Meetings
- `POST /api/meetings/create` - Schedule meeting
- `GET /api/meetings/my-meetings` - Get user meetings
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id/respond` - Accept/Reject meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/my-documents` - Get user documents
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/:id/download` - Download document
- `POST /api/documents/:id/sign` - Add e-signature
- `PUT /api/documents/:id/status` - Update status
- `DELETE /api/documents/:id` - Delete document

### Payments
- `POST /api/payment/deposit` - Deposit money
- `POST /api/payment/withdraw` - Withdraw money
- `POST /api/payment/transfer` - Transfer to user
- `GET /api/payment/history` - Transaction history
- `GET /api/payment/:id` - Get transaction details

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation & sanitization
- XSS & SQL injection prevention
- Role-based authorization

---

## 📅 Project Timeline

- **Start Date:** March 18, 2026
- **Deadline:** March 27, 2026
- **Status:** Week 1, 2, 3 Backend Complete ✅

---

## 🔗 Links

**Repository:** https://github.com/Minahil801/nexus-platform  
**Live Demo:** Coming soon (deployment pending)

---

## 👥 Contributors

Minahil - Full Stack Developer

---

## 📝 License

This project is for internship purposes at DevelopersHub Corporation.