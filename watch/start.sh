#!/bin/bash

echo "🚀 Starting Watch Store Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🔧 Starting backend server..."
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

echo "🌐 Backend is running on http://localhost:5000"
echo "📱 Frontend can be accessed at http://localhost:8000"
echo ""
echo "To start the frontend, open a new terminal and run:"
echo "cd frontend && python -m http.server 8000"
echo ""
echo "Or use any other local server of your choice."
echo ""
echo "Press Ctrl+C to stop the backend server"

# Wait for user to stop the server
wait $BACKEND_PID