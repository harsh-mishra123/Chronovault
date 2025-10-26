async function main() {
  const CapsuleVault = await ethers.getContractFactory("CapsuleVault");
  const vault = await CapsuleVault.deploy();

  await vault.waitForDeployment(); // <-- Waits for contract to be mined

  console.log("✅ CapsuleVault deployed to:", await vault.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  