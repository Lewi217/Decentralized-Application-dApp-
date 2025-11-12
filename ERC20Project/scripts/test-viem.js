import hre from "hardhat";

async function main() {
  console.log("HRE object keys:", Object.keys(hre));
  console.log("Is viem defined?", hre.viem !== undefined);
  
  if (hre.viem) {
    console.log("✓ SUCCESS: hre.viem is available!");
    console.log("Viem methods:", Object.keys(hre.viem));
  } else {
    console.log("✗ ERROR: hre.viem is still undefined!");
  }
}

main().catch(console.error);