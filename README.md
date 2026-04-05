# Cosmos - Spatial Chat Application

Cosmos is a real-time web application that allows users to move around a virtual 2D space. When users get close to each other (within 120 pixels), they are connected and can interact, simulating a real-world spatial communication experience.

## Features

- **Real-time Synchronization:** Powered by Socket.io for immediate movement updates.
- **Spatial Interactions:** Users are only connected to others within a specific proximity limit.
- **Auto-generated Profiles:** Users receive a random name and a random color upon joining.
- **Full-stack Architecture:** 
  - Backend: Node.js, Express, Socket.io
  - Frontend: React App (powered by Vite) + PixiJS for 2D Space Rendering

## Project Structure

```
cosmos/
├── backend/            # Express and Socket.io server
│   ├── server.js       # Main entry point managing WebSocket connections and spatial distance calculation
│   └── package.json    # Backend dependencies
└── frontend/           # Vite + React app
    ├── src/            # Contains React components, styling, and socket client
    └── package.json    # Frontend dependencies
```

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/Sawantkr/COSMOS>
   cd cosmos
   ```

2. **Setup the Backend:**
   Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The server will start running on port `5000`.

3. **Setup the Frontend:**
   Open a new terminal session and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   This will spin up a Vite development server for the React application.

## Technologies Used

- **Frontend:** React, Vite, PixiJS, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
