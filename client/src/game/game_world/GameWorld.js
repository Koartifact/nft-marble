import React from 'react';

import GameLand from '../game_land/GameLand';

import LandInfos from '../../data-stores/nations';

import './GameWorld.css';
import { useStore } from '../../store';

function GameWorld() {
	const lands = useStore((state) => state.lands);

	return (
		<div className='game__world__container'>
			{lands.map((land, index) => {
				return (
					<GameLand key={land.id} landInfo={LandInfos[index]} land={land} />
				);
			})}
		</div>
	);
}

export default GameWorld;
