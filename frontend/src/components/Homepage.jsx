import { motion } from 'framer-motion';
import './Homepage.css';

const Homepage = ({ isConnected, connectWallet }) => {
  const handleGetStarted = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        // If MetaMask is not installed, redirect to download
        window.open("https://metamask.io/download/", "_blank");
        return;
      }
      
      // Check if already connected
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        console.log("Already connected to MetaMask");
        return;
      }
      
      // If MetaMask is installed, trigger connection
      await connectWallet();
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      
      // Don't redirect to download on connection errors
      if (error.code === -32002) {
        alert("MetaMask connection request is already pending. Please check MetaMask extension.");
      } else if (error.code === 4001) {
        console.log("User rejected the connection request");
      } else {
        alert("Failed to connect to MetaMask. Please try again.");
      }
    }
  };

  const features = [
    {
      icon: "🔒",
      title: "Immutable Storage",
      description: "Your capsules are stored permanently on the blockchain, ensuring they can never be lost or tampered with."
    },
    {
      icon: "⏰",
      title: "Time-locked Access",
      description: "Set exact dates and times when your capsules can be opened. Perfect for future messages and memories."
    },
    {
      icon: "🎨",
      title: "NFT Certificates",
      description: "Each time capsule is minted as a unique NFT, giving you proof of ownership and authenticity."
    },
    {
      icon: "📁",
      title: "File Support",
      description: "Upload text messages, images, documents, and other files to preserve your digital memories."
    },
    {
      icon: "🔐",
      title: "Privacy Focused",
      description: "Your content is encrypted and stored on IPFS, ensuring maximum privacy and decentralization."
    },
    {
      icon: "🌍",
      title: "Global Access",
      description: "Access your time capsules from anywhere in the world, as long as you have your wallet."
    }
  ];

  const useCases = [
    {
      title: "📝 Personal Memories",
      description: "Write letters to your future self, store important milestones, or preserve family memories."
    },
    {
      title: "🎓 Educational Goals",
      description: "Set academic targets and unlock motivational messages when you achieve them."
    },
    {
      title: "💼 Business Plans",
      description: "Store business strategies, predictions, or company milestones to review in the future."
    },
    {
      title: "🎁 Surprise Messages",
      description: "Create surprise messages for birthdays, anniversaries, or special occasions."
    },
    {
      title: "📊 Time-based Reveals",
      description: "Release information, announcements, or content at predetermined times."
    },
    {
      title: "🏆 Achievement Rewards",
      description: "Lock rewards or certificates that unlock when certain dates are reached."
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Connect Your Wallet",
      description: "Connect your MetaMask wallet to start creating time capsules.",
      icon: "🦊"
    },
    {
      step: "2",
      title: "Create Your Capsule",
      description: "Write your message, upload files, and set the unlock date.",
      icon: "✍️"
    },
    {
      step: "3",
      title: "Mint as NFT",
      description: "Your capsule is minted as an NFT and stored on the blockchain.",
      icon: "🎨"
    },
    {
      step: "4",
      title: "Wait & Unlock",
      description: "Wait for the unlock time and reveal your memories!",
      icon: "🔓"
    }
  ];

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="hero-content"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Lock Your Memories in Time
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ChronoVault is a decentralized time capsule platform that allows you to store messages, files, and memories on the blockchain, unlockable at future dates of your choice.
          </motion.p>
          
          {!isConnected && (
            <motion.button
              className="animated-cta-button"
              onClick={handleGetStarted}
              whileHover={{ 
                scale: 1.08, 
                boxShadow: [
                  "0 0 40px rgba(0, 255, 255, 0.4)",
                  "0 0 60px rgba(255, 0, 255, 0.3)",
                  "0 0 80px rgba(255, 255, 0, 0.2)"
                ],
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
              }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
            >
              <motion.span
                className="button-text"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                🚀 Get Started - Connect Wallet
              </motion.span>
              <motion.div
                className="button-glow"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.button>
          )}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Choose ChronoVault?
        </motion.h2>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 255, 255, 0.1)" }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="steps-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        
        <div className="steps-grid">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step-card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number">{step.step}</div>
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Use Cases Section */}
      <motion.section 
        className="use-cases-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Perfect For
        </motion.h2>
        
        <div className="use-cases-grid">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className="use-case-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
            >
              <h3 className="use-case-title">{useCase.title}</h3>
              <p className="use-case-description">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      {!isConnected && (
        <motion.section 
          className="cta-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Time Journey?</h2>
            <p className="cta-description">
              Create your first time capsule today and start preserving your memories for the future!
            </p>
            <motion.button
              className="animated-cta-button large"
              onClick={handleGetStarted}
              whileHover={{ 
                scale: 1.08, 
                boxShadow: [
                  "0 0 50px rgba(0, 255, 255, 0.5)",
                  "0 0 70px rgba(255, 0, 255, 0.4)",
                  "0 0 90px rgba(255, 255, 0, 0.3)"
                ],
                y: -8
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 150
              }}
              viewport={{ once: true }}
            >
              <motion.span
                className="button-text"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                🦊 Get Started - Connect Wallet
              </motion.span>
              <motion.div
                className="button-glow"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.button>
          </motion.div>
        </motion.section>
      )}
    </div>
  );
};

export default Homepage;