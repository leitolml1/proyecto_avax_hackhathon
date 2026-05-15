const hre = require("hardhat");

async function main() {
  const P2PEscrow = await hre.ethers.getContractFactory("P2PEscrow");
  const escrow = await P2PEscrow.deploy();

  await escrow.waitForDeployment();

  console.log(`P2PEscrow deployed to: ${await escrow.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
