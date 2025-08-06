sh
#!/bin/sh

PORTS="9002 5000 4500 4400"
INTERVAL=30

echo "[🚀] Starting continuous port watchdog..."

while true; do
  echo "[🧹] Starting port sweep..."

  for PORT in $PORTS; do
    PID=$(fuser $PORT/tcp 2>/dev/null | awk '{print $1}')
    if [ -n "$PID" ] && [ "$PID" -eq "$PID" ] 2>/dev/null; then
      echo "[⚠️] Port $PORT is claimed by PID $PID. Terminating..."
      kill -9 $PID
      echo "[✅] Cleared port $PORT."
    else
      echo "[👌] Port $PORT is free or PID is unreadable."
    fi
  done

  echo "[🏁] Port sweep complete."
  echo "[😴] Sleeping for $INTERVAL seconds..."
  sleep $INTERVAL
done