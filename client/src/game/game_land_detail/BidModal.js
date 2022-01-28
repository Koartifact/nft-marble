import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

import abi from '../../data-stores/tokenAbi.json';
import address from '../../data-stores/tokenAddr';
import { useStore } from '../../store';

import './BidModal.css';

function BidModal({
	setIsBidModalOpen,
	tokenId,
	tokenList,
	fetchLandDetail,
	highestBid,
}) {
	const account = useStore((state) => state.account);
	useEffect(() => {}, []);

	const [bid, setBid] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const changeModalInputHandler = (e) => {
		setBid(e.target.value);
	};

	const clickSendTokenButtonHandler = async () => {
		const web3 = new Web3('HTTP://127.0.0.1:7545');
		const tokenContract = await new web3.eth.Contract(
			JSON.parse(abi),
			address,
			{
				from: account,
			}
		);
		await tokenContract.methods
			.bid(account, tokenId)
			.send({ value: Web3.utils.toWei(bid) })
			.on('receipt', (receipt) => {
				fetchLandDetail();
				tokenList();
				setIsLoading(false);
				setIsBidModalOpen(false);
			})
			.catch((error) => {
				alert(error);
				setIsLoading(false);
				setIsBidModalOpen(false);
			});
	};

	return (
		<div
			className='modal_container'
			onClick={(e) => {
				e.stopPropagation();
			}}>
			<div className='modal' onClick={(e) => e.stopPropagation()}>
				<div className='modal__title'>
					<h2>Bid</h2>
					<p>
						Current Highest Bid:{' '}
						{Web3.utils.fromWei(String(highestBid), 'ether')} eth
					</p>
				</div>
				<div className='modal__input' onClick={(e) => e.stopPropagation()}>
					<input
						type='number'
						min={Web3.utils.fromWei(String(highestBid), 'ether')}
						step='0.000001'
						placeholder='....eth'
						value={bid}
						onChange={changeModalInputHandler}
					/>
				</div>
				<div
					className='modal__button__container'
					onClick={(e) => {
						e.stopPropagation();
						setIsBidModalOpen(false);
					}}>
					<div
						className='modal__submit__button'
						onClick={(e) => {
							e.stopPropagation();
							clickSendTokenButtonHandler();
						}}>
						<i className='far fa-check-circle'></i>
					</div>
					<div
						className='modal__cancel__button'
						onClick={(e) => {
							e.stopPropagation();
							setIsBidModalOpen(false);
						}}>
						<i className='fas fa-ban'></i>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BidModal;
