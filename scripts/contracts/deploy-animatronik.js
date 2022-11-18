import { ethers } from "hardhat";

async function main() {
  console.log("Deploying to network =>", await ethers.provider.getNetwork());

  const [signer] = await ethers.getSigners();
  console.log("Deployer address is =>", await signer.getAddress());

  const AnimatronikContract = await ethers.getContractFactory(
    "AnimatronikContract",
    {
      signer: signer,
    }
  );

  const animatronik = await AnimatronikContract.deploy();

  await animatronik.deployed();
  const { address } = animatronik;

  console.log(`Animatronik deployed to address => ${address}`);
  console.log(
    "Deployed bytecode for Animatronik =>",
    await ethers.provider.getCode(animatronik.address)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
