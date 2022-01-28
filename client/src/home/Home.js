import React, { useEffect } from 'react';
import Web3 from 'web3';
import { Link } from 'react-router-dom';
// import { useStore } from '../store';
import abi from '../data-stores/tokenAbi.json';
import address from '../data-stores/tokenAddr';

import './Home.css';
import { useStore } from '../store';

function Home() {
	const web3 = new Web3('HTTP://127.0.0.1:7545');
	const [tc, setTc] = useStore((state) => [
		state.transactionCount,
		state.setTransactionCount,
	]);
	const [contractOwner, setContractOwner] = useStore((state) => [
		state.contractOwner,
		state.setContractOwner,
	]);

	useEffect(() => {
		async function fetchTotalTransactions() {
			const tokenContract = await new web3.eth.Contract(
				JSON.parse(abi),
				address
			);
			const ttc = await tokenContract.methods.totalTransactionCount().call();
			const contractOwner = await tokenContract.methods.owner().call();
			setContractOwner(contractOwner);
			setTc(ttc);
		}

		fetchTotalTransactions();
	}, []);
	return (
		<div className='home__container'>
			<HomeIntro totalTransactionCount={tc} />
			<HomeDescription />
			<SuggestionBox />
		</div>
	);
}

function HomeIntro({ totalTransactionCount }) {
	return (
		<div className='home__intro_container'>
			<div className='home__intro_box'>
				<div className='home__transactions_number'>
					컨트랙트 내 총 거래횟수 : {totalTransactionCount}
				</div>
				<Link to='/game'>
					<h1>Play Now!</h1>
				</Link>
			</div>
		</div>
	);
}

function HomeDescription() {
	return (
		<div className='home__description__container'>
			<h1 className='home__description__title'>NFT-Marble</h1>
			<p className='home__description__content'>
				{/* 프로젝트 설명 플레이스 홀더 */}
				<b>NFT-Marble</b> 프로젝트는 브루마블의 게임 로직을 블록체인 내에서
				구현한 게임 프로젝트입니다. 유져는 스마트컨트랙트가 배포될 시 Minting된
				36개 (추후 업데이트 될 수 있음.)의 국가들을 Contract Owner / Token
				Owner로 부터 구매 / 판매 할 수 있습니다.
			</p>
			<div className='home__description__button_list'>
				<button>Tutorial</button>
				{/* 클릭 시 게임 월드 페이지로 이동 */}
				<button>
					<Link to='/game'>Play Game</Link>
				</button>
			</div>
			<br />
			<br />
			<br />
			<p className='home__description__content'>
				{/* 프로젝트 설명 플레이스 홀더 */}
				현재 구현된 기능 목록 <br />
				💸 토지 구입 기능 (컨트랙트 오너 =&gt; 유져)
				<br />
				✨ 옥션 기능 (유져 =&gt; 유져) <br />
				✨ 토큰 오너 옥션 시작 기능 <br />
				✨ 토큰 오너 옥션 종료 기능 <br />
				✨ 경매 참여 기능 (bid) <br />
				✨ 옥션 종료시 nft 증여 기능 (경매 참가자 중 가장 높은 금액을 배팅한
				유져) <br />✨ *Working on it: 옥션 종료시 옥션 참여자 (NFT 구매자를 ✨
				*Working on it (asap): 거래 시 수수료 받기 <br />
				✨ *Working on it (asap): 컨트랙트 오너 출금 기능 개발 <br />
				제외한) refund 기능구현 <br />
			</p>
		</div>
	);
}

function SuggestionBox() {
	return (
		<div className='suggestionBox__container'>
			<div className='suggetionBox_img'>
				<img src='img/landImage.jpg' alt='' />
			</div>
			<div className='suggetionBox_description'>
				<h1 className='suggetionBox_description__title'>Claim Land Now</h1>
				<p className='suggetionBox_description__content'>
					🇰🇷 NFT 토큰을 구입하여 토지를 소유하세요.
				</p>
				<button>Learn more</button>
			</div>
		</div>
	);
}

export default Home;
