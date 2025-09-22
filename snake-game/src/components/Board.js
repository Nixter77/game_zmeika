import React from 'react';
import './Board.css';
import Cell from './Cell';

function Board({ snake, food, boardSize }) {
  const isSnake = (x, y) => {
    return snake.some((segment) => segment.x === x && segment.y === y);
  };

  const isFood = (x, y) => {
    return food.x === x && food.y === y;
  };

  const board = [];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      let type = 'empty';
      if (isSnake(j, i)) {
        type = 'snake';
      } else if (isFood(j, i)) {
        type = 'food';
      }
      board.push(<Cell key={`${i}-${j}`} type={type} />);
    }
  }

  return <div className="board">{board}</div>;
}

export default Board;
