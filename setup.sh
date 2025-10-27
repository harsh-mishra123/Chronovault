#!/bin/bash

# ChronoVault Setup Script
echo "🚀 Setting up ChronoVault..."

# Check if Hardhat is installed in the smart contract directory
cd /Users/harshmishra/Desktop/chronovault/chronovault

echo "📦 Installing contract dependencies..."
npm install --silent

echo "🔥 Starting Hardhat local network..."
npx hardhat node &
HARDHAT_PID=$!

# Wait for Hardhat to start
sleep 5

echo "📋 Deploying CapsuleVault contract..."
npx hardhat run scripts/deployCapsule.js --network localhost

echo "✅ Setup complete!"
echo "🌐 Frontend is running at: http://localhost:5173"
echo "⛓️  Hardhat network is running at: http://127.0.0.1:8545"
echo ""
echo "📝 Next steps:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Install MetaMask if you haven't already"
echo "3. Add Hardhat local network to MetaMask:"
echo "   - Network Name: Hardhat Local"
echo "   - RPC URL: http://127.0.0.1:8545"
echo "   - Chain ID: 31337"
echo "   - Currency Symbol: ETH"
echo "4. Import a Hardhat account using one of the private keys shown above"
echo "5. Connect your wallet and start creating time capsules!"
echo ""
echo "Press Ctrl+C to stop the local network"

# Keep the script running
wait $HARDHAT_PID