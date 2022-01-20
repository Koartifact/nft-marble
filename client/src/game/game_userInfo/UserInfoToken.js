import React from 'react';
import { Link } from 'react-router-dom';

import nations from '../../data-stores/nations';

import './UserInfoToken.css';

function UserInfoToken({ tokenId }) {
	return (
		<Link to={`/land/${nations[tokenId].cn.replaceAll(' ', '')}`}>
			<img src={nations[tokenId].imageUrl} alt='' style={{ width: '50px' }} />
		</Link>
	);
}

export default UserInfoToken;
