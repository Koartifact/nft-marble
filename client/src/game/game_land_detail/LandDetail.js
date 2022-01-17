import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

import abi from '../../data-stores/tokenAbi.json';
import address from '../../data-stores/tokenAddr';

import { useParams } from 'react-router-dom';
import { useStore } from '../../store';

import GameUserInfo from '../game_userInfo/GameUserInfo';
import Loading from '../../loading/Loading';

import './LandDetail.css';

function LandDetail() {
	// cn = countryName
	const { cn } = useParams();
	// from local js file
	const nationInfos = useStore((state) => state.nationInfos);

	// loading state
	const account = useStore((state) => state.account);

	// loading state
	const [isLoading, setIsLoading] = useStore((state) => [
		state.isLoading,
		state.setIsLoading,
	]);

	useEffect(() => {
		setIsLoading(true);
		let land;
		const web3 = new Web3('HTTP://127.0.0.1:7545');
		async function fetchLandDetail() {
			const tokenContract = await new web3.eth.Contract(
				JSON.parse(abi),
				address
			);
			// SouthKorea => South Korea => getTokenDetail('South Korea')
			if (cn === 'SouthKorea') {
				land = await tokenContract.methods.getTokenDetail('South Korea').call();
			} else {
				land = await tokenContract.methods.getTokenDetail(cn).call();
			}
			setLand(land);
			setIsLoading(false);
		}
		fetchLandDetail();
	}, []);

	// getting flag imageUrl
	useEffect(() => {
		const nation = nationInfos.find(
			(nation) => nation.cn.replaceAll(' ', '') === cn
		);
		setNation(nation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cn]);

	const [nation, setNation] = useState({});
	const [land, setLand] = useState({});

	return (
		<div className='land_details__container'>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<div className='land_details__left_side'>
						<GameUserInfo />
					</div>
					<div className='land_details__right_side'>
						<div className='land_details__information'>
							<div className='land_details__flag__description'>
								<img
									className='land_details__flag__img'
									src={nation.imageUrl}
									alt='nation_image'
								/>
							</div>
							<h1 className='land_details__nation_name'>
								{nation.cn}
								<hr />
							</h1>
							<div className='land_details__token__details'>
								<div className='land_details__token__infos'>
									<ul>
										<li>TokenId: {land.id}</li>
										<li>Country Name: {land.countryName}</li>
										<li>Available: {String(land.isAvailable)}</li>
										<li>Lastest Price: {land[3]}</li>
									</ul>
								</div>
								{land[2] && account && (
									<div className='land_details__auction__container'>
										<h1>Current Price: {land[3]}</h1>
										<button className='land_details__button'>Bid</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default LandDetail;
