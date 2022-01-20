import Web3 from 'web3';
import _ from 'lodash';

import abi from '../data-stores/tokenAbi.json';
import address from '../data-stores/tokenAddr';

export async function fetchLandDetail(account, cn) {
	const web3 = new Web3('HTTP://127.0.0.1:7545');
	const tokenContract = await new web3.eth.Contract(JSON.parse(abi), address, {
		from: account,
	});
	// SouthKorea => South Korea => getTokenDetail('South Korea')
	if (cn === 'SouthKorea') {
		return await tokenContract.methods.getTokenDetail('South Korea').call();
	} else {
		return await tokenContract.methods.getTokenDetail(cn).call();
	}
}

export async function tokenList(account, erc721list) {
	// setIsLoading(true);
	if (account) {
		try {
			const web3 = new Web3('HTTP://127.0.0.1:7545');
			const tokenContract = await new web3.eth.Contract(
				JSON.parse(abi),
				address,
				{
					from: account,
				}
			);
			const totalSupply = await tokenContract.methods.totalSupply().call();
			// token id arr
			let arr = [];
			// 비교할 token 객체 arr
			let tokens = [];
			for (let i = 0; i < totalSupply; i++) {
				arr.push(i);
			}
			// TODO
			for (let tokenId of arr) {
				let tokenOwner = await tokenContract.methods.ownerOf(tokenId).call();
				if (String(tokenOwner).toLowerCase() === account) {
					tokens.push({ tokenId });
				}
			}
			// tokens + erc721list 후 tokenId로 중복제거
			let uniqArr = _.uniqBy([...erc721list, ...tokens], 'tokenId');
			return uniqArr;
		} catch (error) {
			alert(error);
		}
	} else {
		return;
	}
}
