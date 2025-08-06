#!/bin/sh

PORTS="9002 5000 4500 4400"

echo "[🔍] Scanning ports..."

for PORT in $PORTS; do
    echo "[🔎] Checking port $PORT..."
    PID=$(lsof -i TCP:$PORT -t)
    if [ -n "$PID" ]; then
        echo "[⚠️] Port $PORT is in use by PID $PID. Terminating process..."
        kill -9 $PID
    else
        echo "[✅] Port $PORT is free."
    fi
done

echo "[🌐] Port health check complete."
