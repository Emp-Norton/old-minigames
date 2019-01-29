import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = (props) => {
	return (
		<div class="navbar">
      <h1> 8 Bit Bites! </h1>
      <div class="navbar--button-well">
        <Link to="/snake">
          <button class="navbar--button">Snake</button>
        </Link>
        <Link to="/war">
          <button class="navbar--button">War</button>
        </Link>
        <Link to="/ttt">
          <button class="navbar--button">Tic-Tac-Toe</button>
        </Link>
      </div>
		</div>
		)
}

export default NavBar;
