#!/bin/bash

# 🚀 AI Kanban Agent - De# Start backend
echo "🛠️  Starting Backend (TypeScript)..."
cd kan-back
yarn install --silent
yarn start:dev &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID (TypeScript mode)"nt Startup Script
echo "🚀 Starting AI Kanban Agent Development Environment..."

# Check if ports are available
echo "🔍 Checking ports availability..."

# Backend port (3000)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use (Backend). Stopping process..."
    lsof -ti:3000 | xargs kill -9
fi

# Frontend port (3001)
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3001 is already in use (Frontend). Stopping process..."
    lsof -ti:3001 | xargs kill -9
fi

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "📊 Starting PostgreSQL..."
    brew services start postgresql@14
fi

# Check if Redis is running  
echo "🔴 Checking Redis..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "🔴 Starting Redis..."
    brew services start redis
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 3

# Start backend
echo "�️  Starting Backend (NestJS)..."
cd kan-back
yarn install --silent
yarn start:dev &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Start frontend
echo "� Starting Frontend (Next.js)..."
cd ../kan-front
yarn install --silent
yarn dev &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Final status
echo ""
echo "✅ Development environment is ready!"
echo ""
echo "� Services Status:"
echo "   Backend:  http://localhost:3000 (PID: $BACKEND_PID)"
echo "   Frontend: http://localhost:3001 (PID: $FRONTEND_PID)"
echo "   API Docs: http://localhost:3000/api"
echo ""
echo "🛑 To stop all services: ./scripts/stop-dev.sh"
echo ""

# Keep script running to maintain PIDs
wait
echo "🔗 Adminer: http://localhost:8080"