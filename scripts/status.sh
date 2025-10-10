#!/bin/bash

# 📊 AI Kanban Agent - Status Check
echo "📊 AI Kanban Agent Status Check"
echo "================================"

# Check ports
echo ""
echo "🔍 Port Status:"
PORTS=(3000 3001 5432 6379)
for PORT in "${PORTS[@]}"; do
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        PROCESS=$(lsof -Pi :$PORT -sTCP:LISTEN -t | head -1)
        PROCESS_NAME=$(ps -p $PROCESS -o comm= 2>/dev/null || echo "unknown")
        echo "   Port $PORT: ✅ Active (PID: $PROCESS, Process: $PROCESS_NAME)"
    else
        echo "   Port $PORT: ❌ Free"
    fi
done

# Check services
echo ""
echo "🔧 Service Status:"

# PostgreSQL
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "   PostgreSQL: ✅ Running"
else
    echo "   PostgreSQL: ❌ Not running"
fi

# Redis
if redis-cli ping > /dev/null 2>&1; then
    echo "   Redis: ✅ Running"
else
    echo "   Redis: ❌ Not running"
fi

# Check URLs
echo ""
echo "🌐 URL Status:"

# Backend API
if curl -s http://localhost:3000/api > /dev/null 2>&1; then
    echo "   Backend API: ✅ http://localhost:3000"
    echo "   Swagger UI: ✅ http://localhost:3000/api"
else
    echo "   Backend API: ❌ http://localhost:3000"
fi

# Frontend
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "   Frontend: ✅ http://localhost:3001"
else
    echo "   Frontend: ❌ http://localhost:3001"
fi

echo ""
echo "================================"