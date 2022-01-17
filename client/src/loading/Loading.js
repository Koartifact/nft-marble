import React from 'react';

import './Loading.css';

function Loading() {
	return (
		<div className='spinner_container dark'>
			<img src='/img/spinner.gif' className='spinner__img' alt='loading' />
		</div>
	);
}

export default Loading;
