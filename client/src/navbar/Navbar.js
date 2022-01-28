import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

function Navbar() {
	return (
		<nav className='navbar__container'>
			<ul>
				<li>
					<Link to='/' className='navbar_item'>
						Home
					</Link>
				</li>
				<li>
					<Link to='/game' className='navbar_item'>
						Play Game
					</Link>
				</li>
				<li>
					<Link to='#' className='navbar_item'>
						Tutorial
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
