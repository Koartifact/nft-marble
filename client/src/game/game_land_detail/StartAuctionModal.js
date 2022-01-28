import React, { useState } from 'react';
import Web3 from 'web3';

import { useStore } from '../../store';

import './BidModal.css';

function StartAuctionModal({
	setIsStartAuctionModalOpen,
	landId,
	startAuction,
}) {
	const account = useStore((state) => state.account);

	const [startPrice, setStartPrice] = useState('');

	const changeModalInputHandler = (e) => {
		setStartPrice(e.target.value);
	};

	const clickSendTokenButtonHandler = async () => {
		startAuction(account, landId, Web3.utils.toWei(startPrice, 'ether'));
		setIsStartAuctionModalOpen(false);
	};

	return (
		<div
			className='modal_container'
			onClick={(e) => {
				e.stopPropagation();
			}}>
			<div className='modal' onClick={(e) => e.stopPropagation()}>
				<div className='modal__title'>
					<h2>Starting Price</h2>
				</div>
				<div className='modal__input' onClick={(e) => e.stopPropagation()}>
					<input
						type='number'
						min='0.000001'
						step='0.000001'
						placeholder='....eth'
						value={startPrice}
						onChange={changeModalInputHandler}
					/>
				</div>
				<div
					className='modal__button__container'
					onClick={(e) => {
						e.stopPropagation();
						setIsStartAuctionModalOpen(false);
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
							setIsStartAuctionModalOpen(false);
						}}>
						<i className='fas fa-ban'></i>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StartAuctionModal;
