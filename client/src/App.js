import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store';
import Web3 from 'web3';

import Layout from './layout/Layout';
import Loading from './loading/Loading';
import Home from './home/Home';
import LandDetail from './game/game_land_detail/LandDetail';

import Game from './game/Game';

import abi from './data-stores/tokenAbi.json';
import address from './data-stores/tokenAddr';

function App() {
	const [isLoading, setIsLoading] = useStore((state) => [
		state.isLoading,
		state.setIsLoading,
	]);
	const [web3, setWeb3] = useStore((state) => [state.web3, state.setWeb3]);
	const [contractOwner, setContractOwner] = useStore((state) => [
		state.contractOwner,
		state.setContractOwner,
	]);

	useEffect(() => {
		if (typeof window.ethereum !== 'undefined') {
			try {
				// const web = new Web3(window.ethereum);
				const web = new Web3('HTTP://127.0.0.1:7545');
				setWeb3(web);
			} catch (err) {
				console.log(err);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const fetchContractOwner = async () => {
			const web3 = new Web3('HTTP://127.0.0.1:7545');
			const tokenContract = await new web3.eth.Contract(
				JSON.parse(abi),
				address
			);
			const contractOwner = await tokenContract.methods.owner().call();
			setContractOwner(contractOwner);
		};
		fetchContractOwner();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<BrowserRouter>
			{isLoading ? <Loading /> : null}
			<Layout>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/game' element={<Game />} />
					<Route path='/land/:cn' element={<LandDetail />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}

export default App;
