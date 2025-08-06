#!/bin/bash
echo "Starting AlphaFund Dashboard..."
echo "Date: $(date)"
echo "Server will be available at http://6000-firebase-studio-1754383737159.cluster-lqnxvk7thvfw4wbonsercicksm.cloudworkstations.dev/"
echo ""

cd ~/alphafund/dashboard
node server.js
