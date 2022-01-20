const fs = require('fs');
const path = require('path');

const nations = require('../data-storage/nations');
const NFTMarble = artifacts.require('NFTMarble');

module.exports = async function (deployer) {
	await deployer.deploy(NFTMarble);
	let deployedContract = await NFTMarble.deployed();
	for (let i = 0; i < nations.length; i++) {
		await deployedContract.mint(nations[i]);
	}
	const contract = JSON.parse(fs.readFileSync('./abis/NFTMarble.json', 'utf8'));
	const abiContent = await JSON.stringify(contract.abi);
	const addressContent = await deployedContract.address;

	await fs.writeFile(
		'../client/src/data-stores/tokenAddr.js',
		'module.exports = ' + "'" + addressContent + "'",

		(err) => {
			if (err) {
				console.error(err);
				return;
			}
		}
	);

	await fs.writeFile(
		'../client/src/data-stores/tokenAbi.json',
		JSON.stringify(abiContent),

		(err) => {
			if (err) {
				console.error(err);
				return;
			}
		}
	);
};
