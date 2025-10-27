import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { motion, AnimatePresence } from "framer-motion"
import CreateCapsule from "./components/CreateCapsule.jsx"
import MyCapsules from "./components/MyCapsules.jsx"
import Homepage from "./components/Homepage.jsx"
import contractConfig from "./contract-config.json"
import './App.css'

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null
  })
  const [account, setAccount] = useState('Not connected');
  const [activeTab, setActiveTab] = useState('home');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const redirectToMetaMask = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  const connectWallet = async () => {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
      console.log("Connection already in progress...");
      return;
    }

    setIsConnecting(true);
    const contractAddress = contractConfig.address;
    const contractABI = contractConfig.abi;
    
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        alert("MetaMask not detected! Redirecting to MetaMask website...");
        redirectToMetaMask();
        setIsConnecting(false);
        return;
      }

      // Check if already connected first
      const existingAccounts = await ethereum.request({ 
        method: 'eth_accounts' 
      });

      let accounts;
      if (existingAccounts.length > 0) {
        accounts = existingAccounts;
      } else {
        // Only request accounts if not already connected
        accounts = await ethereum.request({
          method: "eth_requestAccounts"
        });
      }
      
      // Remove existing listeners to prevent duplicates
      if (window.ethereum.removeAllListeners) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
      
      // Add account change listener
      window.ethereum.on("accountsChanged", (newAccounts) => {
        if (newAccounts.length === 0) {
          // User disconnected
          setAccount('Not connected');
          setIsConnected(false);
          setState({ provider: null, signer: null, contract: null });
        } else {
          // Account changed
          setAccount(newAccounts[0]);
          window.location.reload();
        }
      });
      
      setAccount(accounts[0]);
      setIsConnected(true);
      
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      
      let contract = null;
      if (contractAddress) {
        contract = new ethers.Contract(contractAddress, contractABI, signer);
      }
      
      setState({ provider, signer, contract });
      
    } catch (error) {
      console.error("Error connecting wallet:", error);
      
      // Handle specific error types
      if (error.code === 4001) {
        console.log("User rejected the request");
      } else if (error.code === -32002) {
        alert("MetaMask connection request is already pending. Please check MetaMask.");
      } else {
        alert("Failed to connect to MetaMask. Please try again.");
      }
      
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum && !isConnecting) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            const contractAddress = contractConfig.address;
            const contractABI = contractConfig.abi;
            let contract = null;
            if (contractAddress) {
              contract = new ethers.Contract(contractAddress, contractABI, signer);
            }
            
            setState({ provider, signer, contract });
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };
    checkConnection();
  }, [])
  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="cosmic-background">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>
      </div>

      {/* Navigation Header */}
      <motion.header 
        className="app-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="nav-container">
          <motion.div 
            className="logo-section"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="logo">⏰ ChronoVault</h1>
          </motion.div>
          
          <nav className="nav-links">
            <motion.button 
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Home
            </motion.button>
            <motion.button 
              className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isConnected}
              style={{ opacity: !isConnected ? 0.5 : 1 }}
            >
              Create Capsule
            </motion.button>
            <motion.button 
              className={`nav-link ${activeTab === 'mycapsules' ? 'active' : ''}`}
              onClick={() => setActiveTab('mycapsules')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isConnected}
              style={{ opacity: !isConnected ? 0.5 : 1 }}
            >
              My Capsules
            </motion.button>
          </nav>

          <motion.div className="wallet-section">
            {!isConnected ? (
              <motion.button 
                className="get-metamask-btn"
                onClick={redirectToMetaMask}
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 107, 107, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                🦊 Get MetaMask
              </motion.button>
            ) : (
              <motion.div 
                className="wallet-info"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="status-indicator connected"></div>
                <span className="wallet-address">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.header>



      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main 
          className="app-main"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Homepage connectWallet={connectWallet} isConnected={isConnected} />
              </motion.div>
            )}
            {activeTab === 'create' && isConnected && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >
                <CreateCapsule state={state} />
              </motion.div>
            )}
            {activeTab === 'mycapsules' && isConnected && (
              <motion.div
                key="mycapsules"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <MyCapsules state={state} account={account} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </AnimatePresence>
      
      {/* Footer */}
      <motion.footer 
        className="app-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="footer-content">
          <p>Built with ❤️ and ⏰ using React & Ethereum</p>
          <div className="footer-links">
            <motion.a 
              href="https://github.com/harsh-mishra123" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, color: "#00ffff" }}
            >
              GitHub
            </motion.a>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default App