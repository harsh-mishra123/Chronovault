# ChronoVault 🕰️ - Decentralized Time Capsule DApp

> Send messages and files to the future with blockchain-powered time capsules

ChronoVault is a fully decentralized time capsule application that lets you create encrypted time capsules on Ethereum. Your capsules are secured by smart contracts and can only be opened after your specified unlock date.

![ChronoVault Banner](https://via.placeholder.com/800x200/1a1a2e/eee?text=ChronoVault+-+Time+Capsules+on+Blockchain)

## ✨ Features

🔐 **Blockchain Security** - Smart contracts ensure capsules can't be opened early  
🔒 **Client-side Encryption** - AES-256 encryption protects your content  
🌐 **IPFS Storage** - Decentralized storage via Pinata  
🎨 **Modern UI** - React.js with TailwindCSS and smooth animations  
👛 **Easy Wallet Connection** - RainbowKit integration  
📱 **Responsive Design** - Perfect on all devices  

## 🚀 Quick Start

**Ready in 3 steps:**

1. **Deploy Contract** → 2. **Setup Frontend** → 3. **Create Time Capsules**

```bash
# 1. Deploy to Sepolia
npm install && echo "PRIVATE_KEY=your_key" >> .env
npx hardhat run scripts/deployChronoVault.js --network sepolia

# 2. Setup Frontend  
cd frontend && npm install && cp .env.example .env
# Add your Pinata & WalletConnect keys to .env

# 3. Launch
npm start
```

🌐 **Access at**: `http://localhost:3000`

## 📋 Requirements

- [Pinata Account](https://pinata.cloud/) (IPFS storage)
- [WalletConnect Project](https://cloud.walletconnect.com/) (Wallet integration)  
- [Sepolia ETH](https://sepoliafaucet.com/) (For testing)

## 🛠️ Tech Stack

**Smart Contract**: Solidity + OpenZeppelin + Hardhat  
**Frontend**: React.js + TailwindCSS + Framer Motion  
**Web3**: Wagmi + RainbowKit + Ethers.js  
**Storage**: IPFS via Pinata + AES Encryption

## 📖 How It Works

1. **Create** → Encrypt your content and upload to IPFS
2. **Lock** → Smart contract enforces your unlock time  
3. **Wait** → Your capsule is safely locked on the blockchain
4. **Open** → Decrypt and enjoy your message from the past!

## 📂 Project Structure

```
chronovault/
├── contracts/CapsuleVault.sol     # Time-locked smart contract
├── frontend/src/
│   ├── components/                # React components
│   ├── utils/                     # Encryption, IPFS, contracts
│   └── hooks/                     # Custom Web3 hooks
└── scripts/deployChronoVault.js   # Auto-deployment
```

## 🔧 Development

```bash
npx hardhat compile    # Compile contracts
npx hardhat test       # Run tests  
npx hardhat node      # Local blockchain
```

## 📚 Documentation

📖 **[Complete Setup Guide](./SETUP.md)** - Detailed installation and deployment instructions  

## 🔒 Security

✅ **Client-side encryption** - Only you can decrypt your capsules  
✅ **Time-locked contracts** - No early access possible  
✅ **Decentralized storage** - Your data lives on IPFS  
✅ **No servers** - Fully decentralized architecture  

⚠️ **Important**: Save your encryption keys! Lost keys = lost content forever.

## 🤝 Contributing

We welcome contributions! Fork, improve, and submit PRs.

## 📄 License

MIT License - Build amazing things! 🚀

---

**Ready to send messages to the future?** Get started with our [Setup Guide](./SETUP.md)!
