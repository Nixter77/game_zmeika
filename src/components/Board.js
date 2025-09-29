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
  const head = snake[0];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      let type = 'empty';
      let isHead = false;
      if (isSnake(j, i)) {
        type = 'snake';
        if (head && head.x === j && head.y === i) isHead = true;
      } else if (isFood(j, i)) {
        type = 'food';
      }
      board.push(<Cell key={`${i}-${j}`} type={type} isHead={isHead} />);
    }
  }

  return <div className="board">{board}</div>;
}

export default Board;

/* eslint-disable react/prop-types */
