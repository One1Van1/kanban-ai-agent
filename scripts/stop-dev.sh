#!/bin/bash

# 🛑 AI Kanban Agent - Stop Development Environment
echo "🛑 Stopping AI Kanban Agent Development Environment..."

#!/bin/bash

# 🛑 AI Kanban Agent - Stop Development Environment
echo "🛑 Stopping AI Kanban Agent Development Environment..."

# Kill processes on specific ports
echo "� Stopping Backend (port 3000)..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    lsof -ti:3000 | xargs kill -9
    echo "✅ Backend stopped"
else
    echo "ℹ️  Backend not running"
fi

echo "� Stopping Frontend (port 3001)..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    lsof -ti:3001 | xargs kill -9
    echo "✅ Frontend stopped"
else
    echo "ℹ️  Frontend not running"
fi

# Kill Node.js processes related to the project
echo "🔄 Cleaning up Node.js processes..."
pkill -f "nest start" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "yarn start" 2>/dev/null || true
pkill -f "yarn dev" 2>/dev/null || true

# Optional: Stop databases (commented out by default)
# echo "🔄 Stopping databases..."
# brew services stop postgresql@14
# brew services stop redis

echo ""
echo "✅ All services stopped successfully!"
echo ""
echo "💡 To restart: ./scripts/start-dev.sh"

# Stop databases
echo "🗄️  Stopping databases..."
yarn db:down

# Kill any remaining node processes related to our project
echo "🧹 Cleaning up remaining processes..."
pkill -f "nest start"
pkill -f "next dev"
pkill -f "concurrently"

echo "✅ All services stopped successfully!"