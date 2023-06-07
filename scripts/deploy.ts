import { ethers } from "hardhat";
import { SimpleStorage } from "../typechain-types";

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = (await simpleStorageFactory.deploy()) as SimpleStorage;

  console.log("Deploying the SimpleStorage contract...")
  await simpleStorage.deployed();
  const deployer = await simpleStorage.signer.getAddress();

  console.log(
    `Simple with deployed to ${simpleStorage.address} by ${deployer}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
