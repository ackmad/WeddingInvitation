#!/bin/bash

# Get the script's directory and move there
cd "$(dirname "$0")"

# Clear terminal (optional but looks cleaner)
clear

echo "=========================================================="
echo "   🎉 WEDDING INVITATION PROJECT TRIGGER (macOS) 🎉       "
echo "=========================================================="
echo ""

# 1. Check if Node.js is installed
echo "🔍 Checking System Requirements..."
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo "Please download and install it from: https://nodejs.org/"
    echo ""
    read -p "Press [Enter] to exit..."
    exit 1
fi
echo "✅ Node.js $(node --version) is installed."

# 2. Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm is not available!"
    echo ""
    read -p "Press [Enter] to exit..."
    exit 1
fi
echo "✅ npm $(npm --version) is installed."

# 3. Setup Environment Variables (.env)
if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
        echo "📝 Creating .env.local from .env.local.example..."
        cp .env.local.example .env.local
        echo "✅ .env.local created."
    else
        echo "ℹ️  No .env.local.example found, skipping environment setup."
    fi
fi

# 4. Check for node_modules (Installation)
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies (this may take a while)..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully!"
    else
        echo "❌ ERROR: Dependency installation failed."
        read -p "Press [Enter] to exit..."
        exit 1
    fi
else
    echo "✅ node_modules found. Skipping installation."
fi

# 5. Final Step: Run the project
echo ""
echo "🚀 Everything is ready! Starting the development server..."
echo "=========================================================="
echo "The app should be available at http://localhost:3000"
echo ""

npm run dev
