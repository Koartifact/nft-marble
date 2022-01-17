import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

function Navbar() {
	return (
		<nav className='navbar__container'>
			<ul>
				<li>
					<Link to='/game' className='navbar_item'>
						Play game
					</Link>
				</li>
				<li>
					<Link to='#' className='navbar_item'>
						Navbar PlaceHolder
					</Link>
				</li>
				<li>
					<Link to='#' className='navbar_item'>
						Navbar PlaceHolder
					</Link>
				</li>
				<li>
					<Link to='#' className='navbar_item'>
						Navbar PlaceHolder
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
