import React from 'react';
import { useStore } from '../../store';
import './GameUserInfo.css';

function GameUserInfo() {
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

	// connect metamask wallet
	const connectWallet = async () => {
		setIsLoading(true);
		const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		});
		setAccount(accounts[0]);
		setIsLoading(false);
	};

	return (
		<div className='game__user_infos'>
			<h1 className='game__user_info__title'>My Information</h1>
			<div className='game__user_info__finance'>
				{account ? (
					<>
						<p>My Tokens</p>
						<div style={{ display: 'flex', flexWrap: 'wrap' }}>
							{erc721list ? (
								erc721list.map((token) => {
									return <div key={token.tokenId}>{String(token.tokenId)}</div>;
								})
							) : (
								<div>You have no token</div>
							)}
						</div>
					</>
				) : (
					<div className='game__connect_wallet' onClick={connectWallet}>
						<img src='/img/metamask.png' alt='' />
						<p>Connect Your Wallet</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default GameUserInfo;
