import React from 'react';
import { useStore } from '../../store';
import './GameUserInfo.css';
import UserInfoToken from './UserInfoToken';

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

	const [contractOwner, setContractOwner] = useStore((state) => [
		state.contractOwner,
		state.setContractOwner,
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
			{account !== contractOwner ? (
				<h1 className='game__user_info__title'>My Tokens</h1>
			) : (
				<h1 className='game__user_info__title'>Tokens for sell</h1>
			)}
			<div className='game__user_info__finance'>
				{account ? (
					<>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								gap: '15px',
								flexWrap: 'wrap',
								marginTop: '2rem',
							}}>
							{erc721list ? (
								erc721list.map((token) => {
									return (
										<UserInfoToken
											key={token.tokenId}
											tokenId={token.tokenId}
										/>
									);
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
