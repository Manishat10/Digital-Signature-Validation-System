// server/blockchain/web3.js
const { Web3 } = require('web3'); // Use destructuring for Web3 4.x
const { ganacheUrl, contractAddress, contractABI, accountPrivateKey } = require('./config');

// Initialize Web3 with HTTP provider
const web3 = new Web3(ganacheUrl);

// Add account to wallet
const account = web3.eth.accounts.privateKeyToAccount(accountPrivateKey);
web3.eth.accounts.wallet.add(account);

// Initialize contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3, contract, account };