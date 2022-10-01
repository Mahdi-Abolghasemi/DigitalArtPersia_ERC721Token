const DigitalArtPersia = artifacts.require("DigitalArtPersia");

module.exports = (deployer) => {
  deployer.then(async () => {
    try {
      await deployer.deploy(DigitalArtPersia, "DigitalArtPersiaToken", "DPT");
    } catch (err) {
      console.log(("Failed to Deploy Contracts", err));
    }
  });
};
