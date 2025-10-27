import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const CapsuleVault = await ethers.getContractFactory("CapsuleVault");
  const vault = await CapsuleVault.deploy();

  await vault.waitForDeployment(); // <-- Waits for contract to be mined

  const contractAddress = await vault.getAddress();
  console.log("✅ CapsuleVault deployed to:", contractAddress);

  // Load the contract artifact to get the ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/CapsuleVault.sol/CapsuleVault.json");
  const contractArtifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  // Create contract configuration
  const contractConfig = {
    address: contractAddress,
    abi: contractArtifact.abi
  };

  // Write contract config to file
  const configPath = path.join(__dirname, "../../contract-config.json");
  fs.writeFileSync(configPath, JSON.stringify(contractConfig, null, 2));
  
  console.log("📄 Contract configuration saved to contract-config.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  