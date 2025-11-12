import hre from "hardhat";

async function main() {
  // Parse 1,000,000 tokens with 18 decimals
  const initialSupply = hre.ethers.parseUnits("1000000", 18);
  const tokenName = "Lewis Coin";
  const tokenSymbol = "LWC";

  console.log(`\nDeploying MyToken contract with arguments: 
    Supply: 1,000,000 tokens
    Name: ${tokenName}
    Symbol: ${tokenSymbol}\n`);

  // Get contract factory and deploy
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(initialSupply, tokenName, tokenSymbol);
  
  await myToken.waitForDeployment();
  const address = await myToken.getAddress();

  console.log(`MyToken deployed to address: ${address}`);

  // Verify initial state
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  const supply = await myToken.totalSupply();
  const deployerBalance = await myToken.balanceOf(deployerAddress);
  
  console.log(`\n--- Verification Checks ---`);
  console.log(`Deployer's Address: ${deployerAddress}`);
  console.log(`Total Supply: ${hre.ethers.formatUnits(supply, 18)} tokens`); 
  console.log(`Deployer's Balance: ${hre.ethers.formatUnits(deployerBalance, 18)} tokens`); 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});