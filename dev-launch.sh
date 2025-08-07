#!/usr/bin/env bash

set -euo pipefail

VAULT_PORT=${1:-3001}
NEXT_PORT=${2:-9002}

VAULT_STATUS=0
FRONTEND_STATUS=0

check_port_free() {
  local PORT=$1
  if command -v ss &>/dev/null; then
    ! ss -ltnp | grep -q ":$PORT"
  elif command -v netstat &>/dev/null; then
    ! netstat -tuln | grep -q ":$PORT"
  else
    ! lsof -i tcp:$PORT &>/dev/null
  fi
}

# 🧼 Step 1: Clean up stale processes
echo "🔍 Checking for stale processes on ports $VAULT_PORT and $NEXT_PORT..."

for PORT in $VAULT_PORT $NEXT_PORT; do
  echo "🧹 Checking port $PORT..."
  if ! check_port_free "$PORT"; then
    echo "⚠️ Port $PORT is occupied. Attempting cleanup..."
    fuser -k "$PORT"/tcp || true
    sleep 1
    if ! check_port_free "$PORT"; then
      echo "❌ Port $PORT still occupied after cleanup"
      exit 1
    fi
  fi
done

# 🧭 Step 2: Launch services
echo "🚀 Launching vault server on port $VAULT_PORT and Next.js on port $NEXT_PORT..."

PORT=$VAULT_PORT concurrently \
  "PORT=$VAULT_PORT ts-node scripts/vault/server.ts" \
  "next dev --port $NEXT_PORT --hostname 0.0.0.0" &

# 🔐 Step 3: Vault Server Health Check
echo "🔐 Waiting for Vault server to respond..."
for i in {1..10}; do
  if curl -sSf http://localhost:$VAULT_PORT | grep -iq 'vault'; then
    echo "✅ Vault is live on port $VAULT_PORT"
    break
  else
    echo "⏳ Attempt $i: Vault not ready yet..."
    sleep 1
  fi
done

if ! curl -sSf http://localhost:$VAULT_PORT | grep -iq 'vault'; then
  echo "❌ Vault failed to launch after retries"
  VAULT_STATUS=1
fi

#  FRONTEND Health Check
echo "🌐 Waiting for frontend to respond..."
for i in {1..10}; do
    if curl -sSf http://localhost:$NEXT_PORT | grep -iq '<html>'; then
      echo "✅ Frontend is live on port $NEXT_PORT"
      break
    else
      echo "⏳ Attempt $i: frontend not ready yet..."
      sleep 1
    fi
done

if ! curl -sSf http://localhost:$NEXT_PORT | grep -iq '<html>'; then
    echo "❌ Frontend failed to launch after retries"
    FRONTEND_STATUS=1
fi

# 🧾 Step 5: Log status
echo "📜 Services launched:"
echo " - Vault: http://localhost:$VAULT_PORT"
echo " - Next.js: http://localhost:$NEXT_PORT"


echo "{"timestamp":"$(date)","vault_port":$VAULT_PORT,"frontend_port":$NEXT_PORT,"vault_status":$VAULT_STATUS,"frontend_status":$FRONTEND_STATUS}" >> /home/user/studio/logs/dev-launch.json

# 📊 Step 6: Final Status Summary
echo "📊 Launch Summary:"
[ "$VAULT_STATUS" -eq 0 ] && echo "✅ Vault: Healthy" || echo "❌ Vault: Failed"
[ "$FRONTEND_STATUS" -eq 0 ] && echo "✅ Frontend: Healthy" || echo "❌ Frontend: Failed"

if [ "$VAULT_STATUS" -ne 0 ] || [ "$FRONTEND_STATUS" -ne 0 ]; then
  echo "🚨 One or more services failed to launch"
  exit 1
else
  echo "🎉 All services launched successfully"
  wait
fi
