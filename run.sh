#!/bin/bash

echo "=============================="
echo "Checking for Java 21..."
echo "=============================="

# Check for Java 21
if ! java -version 2>&1 | grep "21."; then
    echo "ERROR: Java 21 is not installed."
    echo "Please install it from: https://www.oracle.com/java/technologies/downloads/#jdk21-mac"
    exit 1
fi
echo "Java 21 is installed."
echo ""

echo "=============================="
echo "Checking for Node.js..."
echo "=============================="

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed."
    echo "Please install it from: https://nodejs.org/en/download"
    exit 1
fi
echo "Node.js is installed."
echo ""

echo "=============================="
echo "Starting Backend..."
echo "=============================="

# Start backend in a new terminal
cd backend
gnome-terminal -- bash -c "./mvnw spring-boot:run; exec bash" &  # Linux
osascript -e 'tell application "Terminal" to do script "cd \"$(pwd)\" && ./mvnw spring-boot:run"' & # macOS
cd ..
echo "Backend is starting in a separate window."
echo ""

echo "=============================="
echo "Checking Frontend Dependencies..."
echo "=============================="

# Go to frontend directory
cd frontend

# Check if React is installed
if [ ! -d "node_modules/react" ]; then
    echo "React is not installed. Installing now..."
    npm install react --loglevel=error
    if [ ! -d "node_modules/react" ]; then
        echo "ERROR: React installation failed. Please check your npm setup."
        exit 1
    fi
    echo "React installation finished."
else
    echo "React is already installed."
fi

# Check for MUI libraries
echo "Checking MUI libraries..."
npm install @mui/material @mui/icons-material @mui/x-date-pickers date-fns --loglevel=error

# Verify that MUI libraries are installed correctly
for package in "@mui/material" "@mui/icons-material" "@mui/x-date-pickers" "date-fns"; do
    if [ ! -d "node_modules/$package" ]; then
        echo "ERROR: $package installation failed."
        exit 1
    fi
done

echo "MUI dependencies checked."
echo ""

echo "=============================="
echo "Starting Frontend..."
echo "=============================="

# Start frontend in a new terminal
gnome-terminal -- bash -c "npm start; exec bash" &  # Linux
osascript -e 'tell application "Terminal" to do script "cd \"$(pwd)\" && npm start"' & # macOS

cd ..

echo ""
echo "=============================="
echo "Script execution finished. Press Enter to exit."
echo "=============================="
read -r
