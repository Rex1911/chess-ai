import React from "react";
import Chessboard from "chessboardjsx";
import Chess from "chess.js";

let game;

class ChessBoard extends React.Component {
	state = {
		fen: "start",
		gameStatus: "Running",
		currentPlayer: null,
		squareStyles: {}
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
				gameStatus: "Player " + this.state.currentPlayer + " won."
			});
			return;
		}

		this.setState({ fen: game.fen(), currentPlayer: game.turn() , squareStyles: {}});
	};

	handleClick = s => {
		let potentialMoves = game.moves({ square: s });
		console.log(potentialMoves);
		let temp = {}
		potentialMoves.forEach(move => {
			let formatted = move.match(/([a-z][1-9])/g)
			temp[formatted[0]] = {backgroundColor: "blue", opacity: 0.4}
		})
		this.setState({ squareStyles: temp });
		console.log('click')
	};

	render() {
		return (
			<div>
				<Chessboard
					position={this.state.fen}
					onDrop={this.validate}
					onSquareClick={this.handleClick}
					squareStyles={this.state.squareStyles}
				/>
				<h3>Game status: {this.state.gameStatus}</h3>
				<h3>Current Player: {this.state.currentPlayer}</h3>
			</div>
		);
	}
}

export default ChessBoard;
