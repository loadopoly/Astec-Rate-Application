#!/bin/bash

# IPS Freight Platform - Start Script (Mac/Linux)
# Make executable: chmod +x START.sh
# On Mac you can also double-click START.command

set -e

echo ""
echo " ================================================"
echo "  IPS Freight Platform - Starting Up"
echo " ================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo " ERROR: Docker is not installed!"
    echo ""
    echo " Please:"
    echo "   1. Download Docker Desktop from https://www.docker.com/products/docker-desktop/"
    echo "   2. Install and start Docker Desktop"
    echo "   3. Run this script again"
    echo ""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://www.docker.com/products/docker-desktop/"
    fi
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo " ERROR: Docker is not running!"
    echo ""
    echo " Please start Docker Desktop and try again."
    echo " Look for the Docker whale icon in your menu bar."
    echo ""
    exit 1
fi

echo " [1/3] Docker is running. Good!"
echo ""

# Navigate to the script's directory
cd "$(dirname "$0")"

# Copy default config if .env doesn't exist yet
if [ ! -f .env ]; then
    echo " Setting up default configuration..."
    cp .env.defaults .env
fi

echo " [2/3] Starting all services..."
echo "       (First run takes 3-5 minutes to build; after that it's ~30 seconds)"
echo ""

docker compose up -d

echo ""
echo " [3/3] Waiting for services to be ready..."
sleep 8

echo ""
echo " ================================================"
echo "  SUCCESS! The application is now running."
echo " ================================================"
echo ""
echo "  Open your web browser and go to:"
echo ""
echo "      http://localhost:3000"
echo ""

# Try to open the browser automatically
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:3000"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:3000" 2>/dev/null || true
fi

echo "  To STOP the application, run: ./STOP.sh"
echo ""
