#!/bin/bash

# IPS Freight Platform - Stop Script (Mac/Linux)

cd "$(dirname "$0")"

echo ""
echo " ================================================"
echo "  IPS Freight Platform - Stopping"
echo " ================================================"
echo ""

docker compose down

echo ""
echo " All services stopped."
echo " Your data is saved and will be available next time you start."
echo ""
