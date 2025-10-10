#!/bin/bash

# 🧹 Clean ports script for AI Kanban Agent
echo "🧹 Cleaning up ports for AI Kanban Agent..."

ports=(3000 3001 5432 6379 8080)

for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "🔥 Killing process on port $port..."
        lsof -ti:$port | xargs kill -9
        echo "✅ Port $port cleaned"
    else
        echo "ℹ️  Port $port is free"
    fi
done

echo "✅ All ports cleaned!"