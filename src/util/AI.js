class AI {
	static calcMoves = 0;
	static getPieceValue = (piece, color) => {
		let val = 0;

		switch (piece) {
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

		let finalVal = color == "w" ? val : -val;
		return finalVal;
	};

	static evaluate = game => {
		if(game.in_checkmate()) {
			if(game.turn() == "w") {
				return -9999
			} else if(game.turn() == "b") {
				return 9999
			}
		}
		
		let board = game.board();
		let score = 0;

		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j] != null) {
					let piece = board[i][j].type;
					let color = board[i][j].color;

					score = score + this.getPieceValue(piece, color);
				}
			}
		}
		return score;
	};

	static minimax = (game, depth, alpha, beta, maximizingPlayer) => {
		this.calcMoves++;
		if (depth == 0 || game.game_over()) {
			return { eval: this.evaluate(game), bestMove: null };
		}
		if (maximizingPlayer) {
			let maxEval = -9999;
			let possibleMoves = game.ugly_moves();
			let bestMove = [];

			for (let i = 0; i < possibleMoves.length; i++) {
				let currentMove = possibleMoves[i];
				game.ugly_move(currentMove);
				let res = this.minimax(game, depth - 1, alpha, beta, false);
				game.undo();
				if (res.eval == maxEval) {
					maxEval = res.eval;
					bestMove.push(currentMove);
				} else if (res.eval > maxEval) {
					bestMove = [];
					bestMove.push(currentMove);
					maxEval = res.eval;
				}

				alpha = Math.max(alpha, res.eval);

				if (alpha >= beta) {
					break;
				}
			}
			return {
				eval: maxEval,
				bestMove: bestMove[Math.floor(Math.random() * bestMove.length)]
			};
		} else {
			let minEval = 9999;
			let possibleMoves = game.ugly_moves();
			let bestMove = [];

			for (let i = 0; i < possibleMoves.length; i++) {
				let currentMove = possibleMoves[i];
				game.ugly_move(currentMove);
				let res = this.minimax(game, depth - 1, alpha, beta, true);
				game.undo();
				if (res.eval == minEval) {
					minEval = res.eval;
					bestMove.push(currentMove);
				} else if (res.eval < minEval) {
					bestMove = [];
					bestMove.push(currentMove);
					minEval = res.eval;
				}

				beta = Math.min(beta, res.eval);

				if (beta <= alpha) {
					break;
				}
			}
			return {
				eval: minEval,
				bestMove: bestMove[Math.floor(Math.random() * bestMove.length)]
			};
		}
	};
}

export default AI;
