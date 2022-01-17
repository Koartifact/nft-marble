import React, { useEffect } from 'react';
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
	const [isLoading, setIsLoading] = useStore((state) => [
		state.isLoading,
		state.setIsLoading,
	]);
	useEffect(() => {
		setIsLoading(true);
		async function fetchLands() {
			const web3 = new Web3('HTTP://127.0.0.1:7545');
			const tokenContract = await new web3.eth.Contract(
				JSON.parse(abi),
				address
			);
			const cLands = await tokenContract.methods.getAllLands().call();
			await setLands(cLands);
			await setIsLoading(false);
		}
		fetchLands();
	}, []);

	return (
		<div className='game__container'>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<div className='game__left_side'>
						<GameUserInfo />
					</div>

					<div className='game__right_side'>
						<GameWorld />
					</div>
				</>
			)}
		</div>
	);
}

export default Game;
