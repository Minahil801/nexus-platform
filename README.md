 
# Nexus Platform - Investor & Entrepreneur Collaboration

## 📋 Week 1 Progress ✅

### Completed Features
- ✅ Backend setup (Node.js + Express + MongoDB Atlas)
- ✅ JWT-based authentication
- ✅ User registration & login APIs
- ✅ Role-based access (Investor/Entrepreneur)
- ✅ Frontend integration with backend
- ✅ Profile management APIs

### 🛠️ Tech Stack
**Frontend:** React + TypeScript + Vite  
**Backend:** Node.js + Express  
**Database:** MongoDB Atlas  
**Authentication:** JWT + bcrypt

### 🚀 Setup Instructions

#### Backend
```bash
cd backend
npm install
# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000
npm run dev
```

#### Frontend
```bash
npm install
npm run dev
```

### 📡 API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### 📅 Next Steps (Week 2)
- Meeting scheduling system
- Video calling integration (WebRTC + Socket.IO)
- Document processing chamber

### 📅 Next Steps (Week 3)
- Payment integration (Stripe/PayPal)
- Security enhancements (2FA, validation)
- Final deployment

---
**Deadline:** March 27, 2026  
**Repository:** https://github.com/Minahil801/nexus-platform