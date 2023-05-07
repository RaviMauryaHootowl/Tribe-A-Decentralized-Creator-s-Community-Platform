// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const Funding = await hre.ethers.getContractFactory("crowd_funding_gasless");
  const funding = await Funding.deploy("0x69015912AA33720b842dCD6aC059Ed623F28d9f7");

  await funding.deployed();

  console.log(
    `Deployed to ${funding.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
