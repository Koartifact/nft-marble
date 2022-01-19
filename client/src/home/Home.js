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

	useEffect(() => {
		async function fetchTotalTransactions() {
			const tokenContract = await new web3.eth.Contract(
				JSON.parse(abi),
				address
			);
			const ttc = await tokenContract.methods.totalTransactionCount().call();
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
					Total Transactions : {totalTransactionCount}
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
			<h1 className='home__description__title'>Project Description</h1>
			<p className='home__description__content'>
				{/* 프로젝트 설명 플레이스 홀더 */}
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum dicta
				laboriosam dolores perspiciatis ipsa rem ipsum suscipit eaque
				consectetur molestiae at, voluptatem quasi vel, illo, consequuntur
				quibusdam repellendus exercitationem magni. Lorem, ipsum dolor sit amet
				consectetur adipisicing elit. Eum dicta laboriosam dolores perspiciatis
				ipsa rem ipsum suscipit eaque consectetur molestiae at, voluptatem quasi
				vel, illo, consequuntur quibusdam repellendus exercitationem magni.
			</p>
			<div className='home__description__button_list'>
				<button>Tutorial</button>
				{/* 클릭 시 게임 월드 페이지로 이동 */}
				<button>
					<Link to='/game'>Play Game</Link>
				</button>
				<button>Button</button>
			</div>
			<p className='home__description__content'>
				{/* 프로젝트 설명 플레이스 홀더 */}
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum dicta
				laboriosam dolores perspiciatis ipsa rem ipsum suscipit eaque
				consectetur molestiae at, voluptatem quasi vel, illo, consequuntur
				quibusdam repellendus exercitationem magni. Lorem, ipsum dolor sit amet
				consectetur adipisicing elit. Eum dicta laboriosam dolores perspiciatis
				ipsa rem ipsum suscipit eaque consectetur molestiae at, voluptatem quasi
				vel, illo, consequuntur quibusdam repellendus exercitationem magni.
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
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga,
					consequatur.
				</p>
				<button>Learn more</button>
			</div>
		</div>
	);
}

export default Home;
