import { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import './CreateCapsule.css';

const CreateCapsule = ({ state }) => {
  const [formData, setFormData] = useState({
    message: '',
    unlockDate: '',
    unlockTime: '12:00'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadToIPFS = async (content) => {
    // Mock IPFS upload - creates a more realistic IPFS-like hash
    // In production, you'd use actual IPFS services like Pinata, Infura, or web3.storage
    
    const encoder = new TextEncoder();
    let dataToHash = content;
    
    // If files are selected, include file information in the hash
    if (selectedFiles.length > 0) {
      const fileData = selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));
      dataToHash += JSON.stringify(fileData);
    }
    
    // Create a mock IPFS hash (starts with Qm like real IPFS hashes)
    const data = encoder.encode(dataToHash + Date.now());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Format as IPFS-like hash (base58 encoded appearance)
    return 'Qm' + hexHash.substring(0, 44); // Standard IPFS hash length
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB limit per file
    const maxFiles = 5; // Maximum 5 files
    
    if (files.length > maxFiles) {
      setStatus(`❌ Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setStatus(`❌ File "${file.name}" is too large. Maximum size: 10MB`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(validFiles);
    setStatus('');
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createCapsule = async (e) => {
    e.preventDefault();
    
    if (!state.contract) {
      setStatus('❌ Please connect your wallet first');
      return;
    }

    if (!formData.message.trim() && selectedFiles.length === 0) {
      setStatus('❌ Please enter a message or select files');
      return;
    }

    if (!formData.unlockDate) {
      setStatus('❌ Please select an unlock date');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('📤 Uploading to IPFS...');

      // Create content package with message and files
      const contentData = {
        message: formData.message,
        files: selectedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        timestamp: Date.now(),
        createdBy: 'ChronoVault Demo'
      };

      let contentPackage = JSON.stringify(contentData, null, 2);

      // Upload content to IPFS (mock implementation)
      const ipfsHash = await uploadToIPFS(contentPackage);
      
      // Convert date and time to timestamp
      const unlockDateTime = new Date(`${formData.unlockDate}T${formData.unlockTime}`);
      const unlockTimestamp = Math.floor(unlockDateTime.getTime() / 1000);

      // Check if unlock time is in the future
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (unlockTimestamp <= currentTimestamp) {
        setStatus('❌ Unlock time must be in the future');
        setIsLoading(false);
        return;
      }

      setStatus('⏳ Creating time capsule...');

      // Call smart contract
      const tx = await state.contract.createCapsule(ipfsHash, unlockTimestamp);
      
      setStatus('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();

      // Get the capsule ID from the event
      const event = receipt.logs.find(log => {
        try {
          return state.contract.interface.parseLog(log).name === 'CapsuleCreated';
        } catch {
          return false;
        }
      });

      let capsuleId = 'Unknown';
      if (event) {
        const parsedEvent = state.contract.interface.parseLog(event);
        capsuleId = parsedEvent.args.id.toString();
      }

      setStatus(`✅ Time capsule created successfully! Capsule ID: ${capsuleId}`);
      
      // Reset form
      setFormData({
        message: '',
        unlockDate: '',
        unlockTime: '12:00'
      });
      setSelectedFiles([]);

    } catch (error) {
      console.error('Error creating capsule:', error);
      if (error.reason) {
        setStatus(`❌ Error: ${error.reason}`);
      } else if (error.message.includes('user rejected')) {
        setStatus('❌ Transaction was rejected');
      } else {
        setStatus('❌ Failed to create time capsule');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="create-capsule-container">
      <motion.div 
        className="create-capsule-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          🕰️ Create Your Time Capsule
        </motion.h2>
        <motion.p 
          className="description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Store your message, thoughts, or memories to be unlocked at a future date.
          Your capsule will be secured on the blockchain and represented as an NFT.
        </motion.p>

        <motion.form 
          onSubmit={createCapsule} 
          className="capsule-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <label htmlFor="message">Your Message</label>
            <motion.textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Write your message, thoughts, or memories here..."
              rows="6"
              maxLength="1000"
              required
              whileFocus={{ scale: 1.02, boxShadow: "0 0 25px rgba(0, 255, 255, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className="char-count">
              {formData.message.length}/1000 characters
            </div>
          </motion.div>

          <motion.div 
            className="form-group file-upload-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
          >
            <label>Attach Files (Optional)</label>
            <motion.div 
              className="file-upload-area"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={handleFileSelect}
                className="file-input-hidden"
                accept="image/*,video/*,audio/*,.pdf,.txt,.doc,.docx"
              />
              <label htmlFor="fileInput" className="file-upload-label">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📎 Choose Files
                  <div className="file-upload-hint">
                    Images, videos, audio, documents (Max: 5 files, 10MB each)
                  </div>
                </motion.div>
              </label>
            </motion.div>

            {selectedFiles.length > 0 && (
              <motion.div 
                className="selected-files"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h4>Selected Files ({selectedFiles.length}/5):</h4>
                {selectedFiles.map((file, index) => (
                  <motion.div 
                    key={index} 
                    className="file-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="file-info">
                      <span className="file-icon">
                        {file.type.startsWith('image/') ? '🖼️' : 
                         file.type.startsWith('video/') ? '🎥' : 
                         file.type.startsWith('audio/') ? '🎵' : 
                         file.type.includes('pdf') ? '📄' : '📄'}
                      </span>
                      <div className="file-details">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ❌
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="datetime-group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="form-group">
              <label htmlFor="unlockDate">Unlock Date</label>
              <motion.input
                type="date"
                id="unlockDate"
                name="unlockDate"
                value={formData.unlockDate}
                onChange={handleInputChange}
                min={today}
                required
                whileFocus={{ scale: 1.05 }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="unlockTime">Unlock Time</label>
              <motion.input
                type="time"
                id="unlockTime"
                name="unlockTime"
                value={formData.unlockTime}
                onChange={handleInputChange}
                required
                whileFocus={{ scale: 1.05 }}
              />
            </div>
          </motion.div>

          <motion.button 
            type="submit" 
            className="create-button"
            disabled={isLoading || !state.contract}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 107, 107, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⏳ Creating...
              </motion.span>
            ) : (
              '🚀 Create Time Capsule'
            )}
          </motion.button>
        </motion.form>

        {status && (
          <motion.div 
            className={`status-message ${status.includes('❌') ? 'error' : status.includes('✅') ? 'success' : 'info'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {status}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateCapsule;