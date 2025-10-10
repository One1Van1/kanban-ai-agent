#!/bin/bash

# 🛑 AI Kanban Agent - Stop Development Environment
echo "🛑 Stopping AI Kanban Agent Development Environment..."

# Kill processes on ports
echo "🔥 Stopping Backend (port 3000)..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    lsof -ti:3000 | xargs kill -9
    echo "✅ Backend stopped"
else
    echo "ℹ️  Backend was not running"
fi

echo "🔥 Stopping Frontend (port 3001)..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    lsof -ti:3001 | xargs kill -9
    echo "✅ Frontend stopped"
else
    echo "ℹ️  Frontend was not running"
fi

# Stop databases
echo "🗄️  Stopping databases..."
yarn db:down

# Kill any remaining node processes related to our project
echo "🧹 Cleaning up remaining processes..."
pkill -f "nest start"
pkill -f "next dev"
pkill -f "concurrently"

echo "✅ All services stopped successfully!"