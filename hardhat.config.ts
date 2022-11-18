import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
// might be useful in the future. Don't wanna lose it
// import "@nomicfoundation/hardhat-ethers";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
    ],
  },
  networks: {
    optimisticGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_OPTIMISM_GOERLI}`,
      // @ts-expect-error it's set
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  paths: {
    tests: "./test/contracts",
  },
};

export default config;
