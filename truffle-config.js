module.exports = {
  contracts_build_directory: "client/src/contracts",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "pragma", //<-- this is the magic
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
