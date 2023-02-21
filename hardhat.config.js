require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: { version: "0.8.17", settings: { optimizer: { enabled: true, runs: 200 } }},
	paths: {
		artifacts: "./src/artifacts",
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
		polygon_mumbai: {
			url: ``, // enter polygon alchemy rpcURL here
			accounts: [""], // add admin's private key in this
			allowUnlimitedContractSize: true,
		},
	},
};
