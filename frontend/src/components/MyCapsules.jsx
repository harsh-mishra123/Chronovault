import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import './MyCapsules.css';

const MyCapsules = ({ state, account }) => {
  const [capsules, setCapsules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [openedCapsule, setOpenedCapsule] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state.contract && account !== 'Not connected') {
      fetchMyCapsules();
    }
  }, [state.contract, account]);

  const fetchMyCapsules = async () => {
    try {
      setIsLoading(true);
      setStatus('🔍 Loading your capsules...');

      // Get the user's NFT balance
      const balance = await state.contract.balanceOf(account);
      const capsuleData = [];

      // If the user has capsules, we need to find them
      // Since we don't have enumeration, we'll try to get capsule details by ID
      // This is a limitation - in production, you'd want to index events or use a graph protocol
      
      if (balance > 0) {
        // Try to fetch recent capsule IDs (this is not optimal but works for demo)
        const nextId = await state.contract.nextId();
        
        for (let i = 0; i < nextId && capsuleData.length < balance; i++) {
          try {
            const owner = await state.contract.ownerOf(i);
            if (owner.toLowerCase() === account.toLowerCase()) {
              const capsule = await state.contract.capsules(i);
              capsuleData.push({
                id: i,
                owner: capsule.owner,
                ipfsHash: capsule.ipfsHash,
                unlockTime: capsule.unlockTime,
                isUnlocked: capsule.isUnlocked,
                locallyOpened: false // Track locally whether user has opened this capsule
              });
            }
          } catch (error) {
            // Token doesn't exist or not owned by user
            continue;
          }
        }
      }

      setCapsules(capsuleData);
      setStatus(capsuleData.length > 0 ? '' : '📭 No capsules found');

    } catch (error) {
      console.error('Error fetching capsules:', error);
      setStatus('❌ Error loading capsules');
    } finally {
      setIsLoading(false);
    }
  };

  const openCapsule = async (capsuleId) => {
    try {
      setStatus('🔓 Opening capsule...');
      
      // Find the capsule in our local state first
      const localCapsule = capsules.find(c => c.id === capsuleId);
      if (!localCapsule) {
        setStatus('❌ Capsule not found.');
        return;
      }
      
      // Check current time vs unlock time
      const currentTime = Math.floor(Date.now() / 1000);
      const unlockTime = Number(localCapsule.unlockTime);
      
      console.log('Current time:', currentTime);
      console.log('Unlock time:', unlockTime);
      console.log('Can unlock:', unlockTime <= currentTime);
      
      if (unlockTime > currentTime) {
        const timeRemaining = unlockTime - currentTime;
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        setStatus(`❌ Capsule still locked. Wait ${hours}h ${minutes}m more.`);
        return;
      }
      
      // Get the IPFS hash directly from our local capsule data
      const ipfsHash = localCapsule.ipfsHash;
      
      // Try to get the original message from the stored content
      // In this demo, we'll use a placeholder since we can't retrieve from IPFS
      const demoMessage = `This is a demo time capsule created with ChronoVault. In production, this content would be retrieved from IPFS hash: ${ipfsHash}`;
      
      // Set the opened capsule data for the modal
      setOpenedCapsule({
        id: capsuleId,
        ipfsHash: ipfsHash,
        openedAt: new Date().toLocaleString(),
        originalMessage: demoMessage
      });
      setShowModal(true);
      
      // Update the capsule in our local state to show it as opened
      // Note: This is only local state, not blockchain state
      setCapsules(prevCapsules => 
        prevCapsules.map(capsule => 
          capsule.id === capsuleId 
            ? { ...capsule, locallyOpened: true }
            : capsule
        )
      );
      
      setStatus('✅ Capsule opened successfully!');
      
    } catch (error) {
      console.error('Error opening capsule:', error);
      setStatus('❌ Error opening capsule. Please try again.');
    }
  };

  const copyToClipboard = async (text, type = 'IPFS Hash') => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`✅ ${type} copied to clipboard!`);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setStatus(`✅ ${type} copied to clipboard!`);
        setTimeout(() => setStatus(''), 3000);
      } catch (fallbackError) {
        setStatus(`❌ Failed to copy ${type}`);
      }
      document.body.removeChild(textArea);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setOpenedCapsule(null);
  };

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  const isUnlockable = (unlockTime) => {
    const now = Math.floor(Date.now() / 1000);
    return Number(unlockTime) <= now;
  };

  const getTimeRemaining = (unlockTime) => {
    const now = Math.floor(Date.now() / 1000);
    const timeDiff = Number(unlockTime) - now;
    
    if (timeDiff <= 0) return "Ready to unlock!";
    
    const days = Math.floor(timeDiff / (24 * 60 * 60));
    const hours = Math.floor((timeDiff % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeDiff % (60 * 60)) / 60);
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  if (!state.contract) {
    return (
      <div className="my-capsules-container">
        <div className="message-card">
          <h2>🔗 Connect Your Wallet</h2>
          <p>Please connect your wallet to view your time capsules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-capsules-container">
      <motion.div 
        className="capsules-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          🗂️ My Time Capsules
        </motion.h2>
        <motion.button 
          onClick={fetchMyCapsules} 
          className="refresh-button" 
          disabled={isLoading}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          🔄 Refresh
        </motion.button>
      </motion.div>

      {status && (
        <div className={`status-message ${status.includes('❌') ? 'error' : 'info'}`}>
          {status}
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading capsules...</p>
        </div>
      ) : (
        <motion.div 
          className="capsules-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <AnimatePresence>
            {capsules.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3>📭 No Time Capsules Yet</h3>
                <p>Create your first time capsule to get started!</p>
              </motion.div>
            ) : (
              capsules.map((capsule, index) => (
                <motion.div 
                  key={capsule.id} 
                  className="capsule-card"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 20px 60px rgba(0, 255, 255, 0.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="capsule-header">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      Capsule #{capsule.id}
                    </motion.h3>
                    <motion.div 
                      className={`status-badge ${isUnlockable(capsule.unlockTime) ? 'unlockable' : 'locked'}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.3,
                        type: "spring",
                        stiffness: 300
                      }}
                    >
                      {isUnlockable(capsule.unlockTime) ? '🔓 Unlockable' : '🔒 Locked'}
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="capsule-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <p><strong>Unlock Date:</strong> {formatDate(capsule.unlockTime)}</p>
                    <p><strong>Status:</strong> {getTimeRemaining(capsule.unlockTime)}</p>
                    <p><strong>IPFS Hash:</strong> {capsule.ipfsHash.slice(0, 20)}...</p>
                  </motion.div>

                  {isUnlockable(capsule.unlockTime) && !capsule.locallyOpened && (
                    <motion.button 
                      onClick={() => openCapsule(capsule.id)}
                      className="open-button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)" 
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🔓 Open Capsule
                    </motion.button>
                  )}

                  {capsule.locallyOpened && (
                    <motion.div 
                      className="unlocked-badge"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      ✅ Already Opened
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Opened Capsule Modal */}
      <AnimatePresence>
        {showModal && openedCapsule && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div className="opened-capsule-modal">
              <motion.div 
                className="modal-inner-container"
                initial={{ opacity: 0, scale: 0.7, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
              <motion.div 
                className="modal-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2>🎉✨ Time Capsule Opened! ✨🎉</h2>
                <motion.button 
                  className="close-button"
                  onClick={closeModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </motion.div>

              <motion.div 
                className="modal-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="capsule-details">
                  <div className="detail-row">
                    <span className="detail-label">🆔 Capsule ID:</span>
                    <span className="detail-value">#{openedCapsule.id}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">🕐 Opened At:</span>
                    <span className="detail-value">{openedCapsule.openedAt}</span>
                  </div>
                  
                  <div className="detail-row ipfs-row">
                    <span className="detail-label">🔗 IPFS Hash:</span>
                    <div className="ipfs-container">
                      <span className="ipfs-hash">{openedCapsule.ipfsHash}</span>
                      <motion.button 
                        className="copy-button"
                        onClick={() => copyToClipboard(openedCapsule.ipfsHash)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Copy IPFS Hash"
                      >
                        📋 Copy
                      </motion.button>
                    </div>
                  </div>
                </div>

                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p>🔓 <strong>Congratulations!</strong> Your memories from the past have been unlocked!</p>
                  <p><strong>Note:</strong> This is a demo implementation. In production, your message would be uploaded to IPFS and the hash would link to your actual stored content.</p>
                </motion.div>

                <motion.div 
                  className="demo-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <h4>🔧 Demo Information:</h4>
                  <ul>
                    <li>This hash is generated for demonstration purposes</li>
                    <li>In production, content would be stored on IPFS network</li>
                    <li>Real IPFS integration would use services like Pinata or Infura</li>
                    <li>Your message: <em>"{openedCapsule.originalMessage || 'Message stored on blockchain'}"</em></li>
                  </ul>
                </motion.div>
              </motion.div>

              <motion.div 
                className="modal-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button 
                  className="learn-ipfs-button"
                  onClick={() => window.open('https://docs.ipfs.tech/concepts/what-is-ipfs/', '_blank')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📚 Learn about IPFS
                </motion.button>
                <motion.button 
                  className="close-modal-button"
                  onClick={closeModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✅ Close
                </motion.button>
              </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyCapsules;