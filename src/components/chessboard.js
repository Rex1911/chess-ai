import React from "react";
import Chessboard from "chessboardjsx";
import Chess from "chess.js";
import AI from "../util/AI";

let game;

class ChessBoard extends React.Component {
	state = {
		fen: "start",
		gameStatus: "Running",
		currentPlayer: null,
		squareStyles: {},
		draggable: true,
		searchDepth: 3,
		moveTime: 0 + "s"
	};

	componentDidMount = () => {
		game = new Chess();
		this.setState({ currentPlayer: game.turn() });
	};

	validate = pMove => {
		let mappedMove = {
			from: pMove.sourceSquare,
			to: pMove.targetSquare,
			promotion: "q"
		};

		if (game.move(mappedMove) == null) {
			return;
		}

		if (game.game_over()) {
			this.setState({
				fen: game.fen(),
				gameStatus: "Player " + this.state.currentPlayer + " won.",
				draggable: false
			});
			return;
		}

		this.setState({
			fen: game.fen(),
			currentPlayer: game.turn(),
			squareStyles: {}
		});
		setTimeout(() => {
			this.makeAIMove();
		}, 50);
	};

	makeAIMove = () => {
		AI.calcMoves = 0;
		let d1 = new Date();
		let res = AI.minimax(
			game,
			this.state.searchDepth,
			-99999,
			99999,
			false
		);
		console.log(res);
		console.log(AI.calcMoves);
		let d2 = new Date();
		game.ugly_move(res.bestMove);

		if (game.game_over()) {
			this.setState({
				fen: game.fen(),
				gameStatus: "Player " + this.state.currentPlayer + " won.",
				draggable: false
			});
			return;
		}

		this.setState({
			fen: game.fen(),
			currentPlayer: game.turn(),
			squareStyles: {},
			moveTime: (d2 - d1) / 1000 + "s"
		});
	};

	handleClick = s => {
		let potentialMoves = game.moves({ square: s });
		let temp = {};
		potentialMoves.forEach(move => {
			let formatted = move.match(/([a-z][1-9])/g);
			if (formatted != null)
				temp[formatted[0]] = { backgroundColor: "blue", opacity: 0.4 };
		});
		this.setState({ squareStyles: temp });
	};

	render() {
		return (
			<div>
				<Chessboard
					position={this.state.fen}
					onDrop={this.validate}
					onMouseOverSquare={this.handleClick}
					squareStyles={this.state.squareStyles}
					draggable={this.state.draggable}
				/>
				<p>Game status: {this.state.gameStatus}</p>
				<p>Current Player: {this.state.currentPlayer}</p>
				<p>Move Time: {this.state.moveTime}</p>
			</div>
		);
	}
}

export default ChessBoard;
