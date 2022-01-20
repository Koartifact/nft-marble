import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import _ from 'lodash';
// import { fetchLandDetail, tokenList } from '../../api/api';

import abi from '../../data-stores/tokenAbi.json';
import address from '../../data-stores/tokenAddr';

import { useParams } from 'react-router-dom';
import { useStore } from '../../store';

import GameUserInfo from '../game_userInfo/GameUserInfo';
import Loading from '../../loading/Loading';
import BidModal from './BidModal';

import './LandDetail.css';

function LandDetail() {
	const [isLoading, setIsLoading] = useState(false);
	const [isBidModalOpen, setIsBidModalOpen] = useState(false);
	// cn = countryName
	const { cn } = useParams();
	// from local js file
	const nationInfos = useStore((state) => state.nationInfos);

	// loading state
	const account = useStore((state) => state.account);
	// contractOwner
	const [contractOwner, setContractOwner] = useStore((state) => [
		state.contractOwner,
		state.setContractOwner,
	]);

	// loading state
	// const [isLoading, setIsLoading] = useStore((state) => [
	// 	state.isLoading,
	// 	state.setIsLoading,
	// ]);

	const [erc721list, setErc721list] = useStore((state) => [
		state.erc721list,
		state.setErc721list,
	]);

	/// need to relocate
	async function fetchLandDetail() {
		let land;
		const web3 = new Web3('HTTP://127.0.0.1:7545');
		const tokenContract = await new web3.eth.Contract(
			JSON.parse(abi),
			address,
			{ from: account }
		);
		// SouthKorea => South Korea => getTokenDetail('South Korea')
		if (cn === 'SouthKorea') {
			land = await tokenContract.methods.getTokenDetail('South Korea').call();
			// land.latestPrice = Web3.utils.fromWei(land[3], 'ether');
		} else {
			land = await tokenContract.methods.getTokenDetail(cn).call();
		}
		setLand(land);
	}

	async function tokenList() {
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
				// let uniqArr = _.uniqBy([...erc721list, ...tokens], 'tokenId');
				await setErc721list(tokens);
			} catch (error) {
				alert(error);
			}
		} else {
			return;
		}
	}

	const fetchContractOwner = async () => {
		const web3 = new Web3('HTTP://127.0.0.1:7545');
		const tokenContract = await new web3.eth.Contract(JSON.parse(abi), address);
		const contractOwner = await tokenContract.methods.owner().call();
		await setContractOwner(contractOwner);
		// await console.log(contractOwner);
	};
	/// need to relocate
	useEffect(() => {
		// setIsLoading(true);
		// setLand(fetchLandDetail(account, cn));
		// setErc721list(tokenList(account, erc721list));
		// setIsLoading(false);

		setIsLoading(true);
		fetchLandDetail();
		tokenList();
		fetchContractOwner();
		setIsLoading(false);
	}, [account]);

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

	// TODO
	// need to add start price
	const startAuction = async (account, tokenId, startPrice) => {
		setIsLoading(true);
		const web3 = new Web3('HTTP://127.0.0.1:7545');
		const tokenContract = await new web3.eth.Contract(
			JSON.parse(abi),
			address,
			{ from: account, gas: 10000000 }
		);
		await tokenContract.methods
			.startAuction(account, tokenId, startPrice)
			.send()
			.on('receipt', (receipt) => {
				fetchLandDetail();
				setIsLoading(false);
			})
			.catch((error) => {
				alert(error);
				setIsLoading(false);
			});
	};
	const closingAuction = async (account, tokenId) => {
		setIsLoading(true);
		const web3 = new Web3('HTTP://127.0.0.1:7545');
		const tokenContract = await new web3.eth.Contract(
			JSON.parse(abi),
			address,
			{ from: account, gas: 10000000 }
		);
		await tokenContract.methods
			.closingAuction(account, tokenId)
			.send()
			.on('receipt', (receipt) => {
				console.log(receipt);
				fetchLandDetail();
				tokenList();
				setIsLoading(false);
			})
			.catch((error) => {
				alert(error);
				setIsLoading(false);
			});
	};
	const buyLand = async (account, tokenId) => {
		setIsLoading(true);
		const web3 = new Web3('HTTP://127.0.0.1:7545');
		const tokenContract = await new web3.eth.Contract(
			JSON.parse(abi),
			address,
			{ from: account, gas: 10000000 }
		);
		await tokenContract.methods
			.buyLand(account, tokenId)
			.send()
			.on('receipt', (receipt) => {
				fetchLandDetail();
				tokenList();
				setIsLoading(false);
			})
			.catch((error) => {
				alert(error);
				setIsLoading(false);
			});
	};
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
									{land[3] ? (
										<ul>
											<li>TokenId: {land.id}</li>
											<li>Country Name: {land.countryName}</li>
											<li>Auction State: {String(land.isAuctionAvailable)}</li>
											<li>
												LatestPrice:{' '}
												{Web3.utils.fromWei(land.latestPrice, 'ether')} ether
											</li>
											<li>OwnedBy: {land.ownedBy}</li>
										</ul>
									) : null}
								</div>
								{Boolean(
									account &&
										account !== contractOwner &&
										land &&
										land.ownedBy?.toLowerCase() === contractOwner?.toLowerCase()
								) && (
									<div className='land_details__auction__container'>
										<h1>Buy Land</h1>
										<button
											className='land_details__button'
											onClick={() => buyLand(account, land.id)}>
											Buy Land
										</button>
									</div>
								)}
								{account &&
									land &&
									!land.isAuctionAvailable &&
									land.ownedBy?.toLowerCase() === account && (
										<div className='land_details__auction__container'>
											<h1>Start Auction</h1>
											<button
												className='land_details__button'
												onClick={() => startAuction(account, land.id, 1000)}>
												Start Auction
											</button>
										</div>
									)}
								{account &&
									land &&
									land.isAuctionAvailable &&
									land.ownedBy?.toLowerCase() !== account && (
										<div className='land_details__auction__container'>
											<h1>Highest Bid: </h1>
											<button
												className='land_details__button'
												onClick={() => setIsBidModalOpen(true)}>
												Bid
											</button>
										</div>
									)}
								{account &&
									land &&
									land.isAuctionAvailable &&
									land.ownedBy?.toLowerCase() === account && (
										<div className='land_details__auction__container'>
											<h1>Highest Bid: </h1>
											<button
												className='land_details__button'
												onClick={() => closingAuction(account, land.id)}>
												Close Auction
											</button>
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

// function bid() {}

// function auctionManagement() {}

export default LandDetail;
