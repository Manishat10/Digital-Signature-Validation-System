const SignatureChain = artifacts.require("SignatureChain");

module.exports = async function (deployer) {
  await deployer.deploy(SignatureChain);
};
