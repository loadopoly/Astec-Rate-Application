@echo off
title IPS Freight Platform - Stopping...
color 0E

echo.
echo  ================================================
echo   IPS Freight Platform - Stopping
echo  ================================================
echo.

cd /d "%~dp0"
docker compose down

echo.
echo  All services stopped.
echo  Your data is saved and will be available next time you start.
echo.
pause
