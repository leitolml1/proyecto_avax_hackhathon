require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const FUJI_RPC_URL = process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

function normalizePrivateKey(privateKey) {
  if (!privateKey) {
    return undefined;
  }

  return privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    fuji: {
      url: FUJI_RPC_URL,
      chainId: 43113,
      accounts: PRIVATE_KEY ? [normalizePrivateKey(PRIVATE_KEY)] : [],
    },
  },
};
