#!/bin/bash

# 🧹 Clean ports script for AI Kanban Agent
echo "🧹 Cleaning up ports for AI Kanban Agent..."

ports=(3000 3001 5432 6379)

for port in "${ports[@]}"; do
    echo "🔍 Checking port $port..."
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "🔥 Killing process on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        echo "✅ Port $port cleaned"
    else
        echo "✅ Port $port is free"
    fi
done

# Additional cleanup for Node.js processes
echo "🔄 Cleaning up Node.js processes..."
pkill -f "nest start" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "yarn start" 2>/dev/null || true
pkill -f "yarn dev" 2>/dev/null || true

echo ""
echo "✅ All ports cleaned successfully!"