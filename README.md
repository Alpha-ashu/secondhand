# Secondhand Marketplace App

A full-stack marketplace application for buying and selling secondhand items including electronics, precious metals, and collectibles.

## Features

- **Authentication System**: Register, login, logout, forgot password
- **Social Login**: Google and Apple sign-in simulation
- **Product Categories**: Electronics, precious metals, collectibles
- **Bidding System**: For collectible items
- **Chat/Messaging**: Communication between buyers and sellers
- **Responsive Design**: Mobile-first with desktop optimization
- **Image Support**: Cloudinary integration for product images

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT tokens
- **Database**: MongoDB with Mongoose
- **Image Storage**: Cloudinary

## Quick Start

### Option 1: Batch Script (Windows)
```bash
# Double-click or run from command line
start.bat
```

### Option 2: PowerShell Script (Windows)
```powershell
# Right-click and "Run with PowerShell" or run from PowerShell
.\start.ps1
```

### Option 3: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd "Shopping App"
npm run dev
```

## URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

## Environment Setup

1. **Backend**: Copy `.env.example` to `.env` and configure:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - Cloudinary credentials (optional)

2. **Install Dependencies**:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd "Shopping App" && npm install
   ```

## Project Structure

```
secondhand/
├── backend/           # Node.js/Express API
├── Shopping App/      # React frontend
├── start.bat         # Windows batch launcher
├── start.ps1         # PowerShell launcher
└── package.json      # Root package.json
```

## Development

- Backend runs on port 3001
- Frontend runs on port 5173
- MongoDB connection required for full functionality
- Both servers start automatically with launcher scripts
