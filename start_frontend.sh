#!/bin/bash

echo "========================================"
echo "Starting Frontend (Next.js)..."
echo "========================================"

cd frontend

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
    echo "✅ Dependencies installed."
fi

npm run dev
