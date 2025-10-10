#!/bin/bash

# 🚀 AI Kanban Agent - Development Startup Script
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

# Start databases first
echo "🗄️  Starting databases..."
yarn db:up

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 5

# Start both frontend and backend concurrently
echo "🎯 Starting Backend and Frontend concurrently..."
yarn start:dev

echo "✅ AI Kanban Agent is running!"
echo "🔗 Backend: http://localhost:3000"
echo "🔗 Frontend: http://localhost:3001"
echo "🔗 API Docs: http://localhost:3000/api"
echo "🔗 Adminer: http://localhost:8080"