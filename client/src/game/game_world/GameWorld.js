import React from 'react';

import GameLand from '../game_land/GameLand';

import LandInfos from '../../data-stores/nations';

import './GameWorld.css';
import { useStore } from '../../store';

function GameWorld() {
	const WORLD_LENGTH = 6;
	const [lands, setLands] = useStore((state) => [state.lands, state.setLands]);

	return (
		<div
			className='game__world__container'
			style={{ gridTemplateColumns: `repeat(${WORLD_LENGTH}, 1fr)` }}>
			{lands.map((land, index) => {
				return (
					<GameLand key={land.id} landInfo={LandInfos[index]} land={land} />
				);
			})}
		</div>
	);
}

export default GameWorld;
