import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

function Header({ clickWallet, accountAddr }) {
	const [searchInput, setSearchInput] = useState('');

	const changeInputHandler = (e) => {
		setSearchInput(e.target.value);
	};
	const clickClearSearchInputHandler = () => {
		setSearchInput('');
	};

	return (
		<div className='header'>
			<Link to='/'>
				<div className='header__logo'>
					<img src='/img/opensea.svg' alt='' className='header__logo__img' />
					<h3 className='header__logo__title'>NFT-MARBLE</h3>
				</div>
			</Link>

			<div className='search_box'>
				<a
					className='search_box__btn'
					href={`https://ropsten.etherscan.io/address/${searchInput}`}
					target='_blank'
					rel='noopener noreferrer'>
					<i className='fas fa-search'></i>
				</a>
				<input
					className='search_box__input'
					type='text'
					placeholder='search contract address, wallet address.. from Ropsten Testnet Network '
					onChange={changeInputHandler}
					value={searchInput}
				/>
				<button
					className='search_box__remove_btn'
					onClick={clickClearSearchInputHandler}>
					<i className='fas fa-backspace'></i>
				</button>
			</div>

			<div className='header__account'>
				{accountAddr ? (
					<div className='header__account__address'>
						<h4>{accountAddr}</h4>
					</div>
				) : null}
				<div
					className='header__account__user-icon'
					onClick={() => clickWallet()}
					title='connect with wallet'>
					<i className='fas fa-wallet'></i>
				</div>
				<a
					className='header__account__user-icon'
					title='go to github repo'
					href={`https://github.com/Dongmoon29/nft-marble`}
					target='_blank'
					rel='noopener noreferrer'>
					<i className='fab fa-github'></i>
				</a>
			</div>
		</div>
	);
}

export default Header;
