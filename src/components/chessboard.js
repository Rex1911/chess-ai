import React from "react";
import Chessboard from "chessboardjsx";
import Chess from "chess.js";
import AI from "../util/AI";

let game;

class ChessBoard extends React.Component {
	state = {
		fen: 'start',
		gameStatus: "Running",
		currentPlayer: null,
		squareStyles: {},
		draggable: true
	}

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

		this.setState({ fen: game.fen(), currentPlayer: game.turn() , squareStyles: {}});
		this.makeAIMove()
	};

	makeAIMove = () => {
		console.log("Making AI Move")
		let bestMove = AI.getBestMove(game);
		console.log(bestMove);
		game.move(bestMove)

		if (game.game_over()) {
			this.setState({
				fen: game.fen(),
				gameStatus: "Player " + this.state.currentPlayer + " won.",
				draggable: false
			});
			return;
		}

		this.setState({ fen: game.fen(), currentPlayer: game.turn() , squareStyles: {}});
	}

	handleClick = s => {
		let potentialMoves = game.moves({ square: s });
		let temp = {}
		potentialMoves.forEach(move => {
			let formatted = move.match(/([a-z][1-9])/g)
			temp[formatted[0]] = {backgroundColor: "blue", opacity: 0.4}
		})
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
				<h3>Game status: {this.state.gameStatus}</h3>
				<h3>Current Player: {this.state.currentPlayer}</h3>
			</div>
		);
	}
}

export default ChessBoard;
