import React, { useEffect } from 'react';
import _ from 'lodash';
import Web3 from 'web3';

import abi from '../data-stores/tokenAbi.json';
import address from '../data-stores/tokenAddr';

import GameWorld from './game_world/GameWorld';
import GameUserInfo from './game_userInfo/GameUserInfo';

import Loading from '../loading/Loading';

import './Game.css';
import { useStore } from '../store';

function Game() {
	const [lands, setLands] = useStore((state) => [state.lands, state.setLands]);
	const [account, setAccount] = useStore((state) => [
		state.account,
		state.setAccount,
	]);
	const [erc721list, setErc721list] = useStore((state) => [
		state.erc721list,
		state.setErc721list,
	]);
	const [isLoading, setIsLoading] = useStore((state) => [
		state.isLoading,
		state.setIsLoading,
	]);

	useEffect(() => {
		async function fetchLands() {
			const web3 = new Web3('HTTP://127.0.0.1:7545');
			const tokenContract = await new web3.eth.Contract(
				JSON.parse(abi),
				address
			);
			const cLands = await tokenContract.methods.getAllLands().call();
			await setLands(cLands);
		}
		// TODO
		async function tokenList() {
			console.log('addNewErc721 called');
			setIsLoading(true);
			if (account) {
				try {
					const web3 = new Web3('HTTP://127.0.0.1:7545');
					const tokenContract = await new web3.eth.Contract(
						JSON.parse(abi),
						address
					);
					const totalSupply = await tokenContract.methods.totalSupply().call();
					// token id arr
					let arr = [];
					// 비교할 token 객체 arr
					let tokens = [];
					for (let i = 0; i < totalSupply; i++) {
						arr.push(i);
					}
					for (let tokenId of arr) {
						let tokenOwner = await tokenContract.methods
							.ownerOf(tokenId)
							.call();
						if (String(tokenOwner).toLowerCase() === account) {
							tokens.push({ tokenId });
						}
					}
					// tokens + erc721list 후 tokenId로 중복제거
					let uniqArr = _.uniqBy([...erc721list, ...tokens], 'tokenId');
					await setErc721list(uniqArr);
				} catch (error) {
					alert(error);
				}
			} else {
				return;
			}
		}
		fetchLands();
		tokenList();
		setIsLoading(false);
	}, [account]);

	return (
		<div className='game__container'>
			<div className='game__left_side'>
				<GameUserInfo />
			</div>

			<div className='game__right_side'>
				<GameWorld />
			</div>
		</div>
	);
}

export default Game;
