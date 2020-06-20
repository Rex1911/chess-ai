class AI {
	static getPieceValue = (piece,color) => {
		let val = 0

		switch(piece) {
			case "p":
				val = 10;
				break;
			case "n":
				val = 30;
				break;
			case "b":
				val = 30;
				break;
			case "r":
				val = 50;
				break;
			case "q":
				val = 90;
				break;
			case "k":
				val = 900;
				break;
		}

		let finalVal = color == "w" ? val : -val
		return finalVal;
	}
	
	static evaluate = (game) => {
		let board = game.board()
		let score = 0;

		for(let i = 0; i < board.length; i++) {
			for(let j = 0; j < board[i].length; j++) {
				if(board[i][j] != null) {
					let piece = board[i][j].type
					let color = board[i][j].color

					score = score + this.getPieceValue(piece,color)
				}
			}
		}
		return score;
	}
	
	static getBestMove = (game) => {
		let possibleMoves = game.moves()
		let bestEvalValue = 9999
		let bestMove = null;

		for(let i = 0; i < possibleMoves.length; i++) {
			let currentMove = possibleMoves[i];
			game.move(currentMove);

			let currentEvalValue = this.evaluate(game)
			if(currentEvalValue < bestEvalValue) {
				bestMove = currentMove
				bestEvalValue = currentEvalValue;
			}
			game.undo();
		}
		return bestMove;
	}
}

export default AI