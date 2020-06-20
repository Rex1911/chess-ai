class AI {
	static depth = 3;
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
		let bestMove = [];

		for(let i = 0; i < possibleMoves.length; i++) {
			let currentMove = possibleMoves[i];
			game.move(currentMove);

			let currentEvalValue = this.evaluate(game)
			if(currentEvalValue == bestEvalValue) {
				bestMove.push(currentMove)
				bestEvalValue = currentEvalValue;
			} else if(currentEvalValue < bestEvalValue) {
				bestMove = [];
				bestMove.push(currentMove)
				bestEvalValue = currentEvalValue;
			}
			game.undo();
		}
		return bestMove[Math.floor(Math.random() * bestMove.length)];
	}

	static minimax = (game, depth, maximizingPlayer) => {
		if(depth == 0 || game.game_over()) {
			return {eval: this.evaluate(game), bestMove: null}
		}

		if(maximizingPlayer) {
			let maxEval = -9999
			let possibleMoves = game.moves()
			let bestMove = [];

			for(let i = 0; i < possibleMoves.length; i++) {
				let currentMove = possibleMoves[i];
				game.move(currentMove);
				let res = this.minimax(game, depth - 1, false)
				game.undo();
				if(res.eval == maxEval) {
					maxEval = res.eval;
					bestMove.push(currentMove)
				} else if(res.eval > maxEval) {
					bestMove = [];
					bestMove.push(currentMove)
					maxEval = res.eval;
				}
			}
			return {eval: maxEval, bestMove: bestMove[Math.floor(Math.random() * bestMove.length)]}
		} else {
			let minEval = 9999
			let possibleMoves = game.moves()
			let bestMove = [];

			for(let i = 0; i < possibleMoves.length; i++) {
				let currentMove = possibleMoves[i];
				game.move(currentMove);
				let res = this.minimax(game, depth - 1, true)
				game.undo();
				if(res.eval == minEval) {
					minEval = res.eval;
					bestMove.push(currentMove)
				} else if(res.eval < minEval) {
					bestMove = [];
					bestMove.push(currentMove)
					minEval = res.eval;
				}
			}
			return {eval: minEval, bestMove: bestMove[Math.floor(Math.random() * bestMove.length)]}
		}
	}
}

export default AI