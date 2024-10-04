require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  mocha: {
    timeout: 3600000,
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 500,
      },
    },
  },
  defaultNetwork: "hedera",
  networks: {
    hedera: {
      url: process.env.TESTNET_ENDPOINT, //Hedera TestNet API endpoints
      accounts: [process.env.TESTNET_OPERATOR_PRIVATE_KEY], //Hedera Testnet Private Key
    //  chainId: process.env.TESTNET_CHAIN_ID,  // Hedera testnet chain ID
    },
  },
};
