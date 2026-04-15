#!/bin/bash
# Double-click this file on Mac to start the IPS Freight Platform.
# The first time macOS may ask "Are you sure?" — click Open.

# Self-heal: make sure all scripts are executable so the user never needs
# to open Terminal just to run chmod.
chmod +x "$(dirname "$0")/START.sh" \
         "$(dirname "$0")/START.command" \
         "$(dirname "$0")/STOP.sh" \
         "$(dirname "$0")/STOP.command" 2>/dev/null || true

cd "$(dirname "$0")"
bash START.sh
read -p "Press Enter to close..."
