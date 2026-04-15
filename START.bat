@echo off
title IPS Freight Platform - Starting...
color 0A

echo.
echo  ================================================
echo   IPS Freight Platform - Starting Up
echo  ================================================
echo.

:: Check if Docker is installed and running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  ERROR: Docker is not running!
    echo.
    echo  Please:
    echo    1. Download Docker Desktop from https://www.docker.com/products/docker-desktop/
    echo    2. Install it (just click Next, Next, Finish)
    echo    3. Wait for Docker Desktop to fully start (whale icon in taskbar)
    echo    4. Double-click this file again
    echo.
    echo  Press any key to open the Docker download page...
    pause >nul
    start https://www.docker.com/products/docker-desktop/
    exit /b 1
)

echo  [1/3] Docker is running. Good!
echo.
echo  [2/3] Building and starting all services...
echo        (This may take 3-5 minutes on first run)
echo.

cd /d "%~dp0"
docker compose up --build -d

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  ERROR: Failed to start the application.
    echo  Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo  [3/3] Waiting for services to be ready...
timeout /t 8 /nobreak >nul

echo.
echo  ================================================
echo   SUCCESS! The application is now running.
echo  ================================================
echo.
echo   Open your web browser and go to:
echo.
echo       http://localhost:3000
echo.
echo   Press any key to open it automatically...
pause >nul
start http://localhost:3000

echo.
echo  To STOP the application, run STOP.bat
echo.
