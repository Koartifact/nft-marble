import React from 'react';
import { Link } from 'react-router-dom';

import './GameLand.css';

function GameLand({ land, landInfo }) {
	const landImageStyle = {
		backgroundImage: `url(${landInfo.imageUrl})`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	};

	return (
		<Link
			className='game__land'
			title={`
TokenId: ${land.id}
CountryName: ${land.countryName}
Auction Available: ${land.isAuctionAvailable}
Latest Price: ${land.latestPrice}
`}
			to={`/land/${land.countryName.replaceAll(' ', '')}`}
			style={landImageStyle}>
			{/* Land #{landId + 1} */}
		</Link>
	);
}

export default GameLand;
