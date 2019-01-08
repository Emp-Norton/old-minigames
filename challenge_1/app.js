
const app = { currentTurn: undefined, cells: []};

app.init = function () {

	if (!app.currentTurn) {
		let response = prompt('Which player goes first?');
		response === 'o' || response === 'O' ? app.currentTurn = 'O' : app.currentTurn = 'X';
	};

	app.resetGame();
	app.cells = document.querySelectorAll('.col');
	app.cells.forEach(cell => {
		cell.addEventListener('click', app.togglePiece);
	})
	document.querySelector('.reset').addEventListener('click', app.resetGame);
}

app.resetGame = function () {
	window.pauseGame = false;
	window.board = [[],[],[]];
	app.cells.forEach(cell => {
		cell.innerText = '';
	})
}

app.togglePiece = function () {
	if (!window.pauseGame) {
		const [row, col] = [parseInt(this.id[1]), parseInt(this.id[3])];
		if (!window.board[row][col]) {
		  window.board[row][col] = app.currentTurn;
		  this.innerText = app.currentTurn;
		  if (app.checkWin()) {
		  	alert(`Player: ${app.currentTurn} wins!`);
		  	window.pauseGame = true;
		  } else {
			  app.currentTurn = app.currentTurn === 'O' ? 'X' : 'O';
		  }
		} else {
			alert('Invalid move! That place is already spoken for. Try again.')
		}
	}
}

app.checkWin = function (player = app.currentTurn) {
	let result;
	let row1 = window.board[0];
	let row2 = window.board[1];
	let row3 = window.board[2];
	let col1 = [window.board[0][0], window.board[1][0], window.board[2][0]];
	let col2 = [window.board[0][1], window.board[1][1], window.board[2][1]];
	let col3 = [window.board[0][2], window.board[1][2], window.board[2][2]];
	let diag1 = [window.board[0][0], window.board[1][1], window.board[2][2]];
	let diag2 = [window.board[0][2], window.board[1][1], window.board[2][0]];
	let states = [row1, row2, row3, col1, col2, col3, diag1, diag2];
	states.forEach(state => {
		if (JSON.stringify(state) === JSON.stringify([player, player, player])) {
			result = true
		}
	})
	return result;
}

app.init();