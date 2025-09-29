import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import Board from './Board';

const BOARD_SIZE = 20;
const GAME_SPEED = 150;

// Sound URLs (best guess)
const moveSoundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-video-game-retro-click-237.mp3';
const eatSoundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-bonus-earned-in-video-game-2058.mp3';
const gameOverSoundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-long-game-over-notification-237.mp3';

/**
 * Generates a random food position that is not on the snake.
 * Note: In the unlikely event the snake fills the board, this could cause an infinite loop.
 */
const getRandomFood = (snake = []) => {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

const initialSnake = [{ x: 10, y: 10 }];

function Game() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(getRandomFood(initialSnake));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      const v = localStorage.getItem('cyber-snake-highscore');
      return v ? Number(v) : 0;
    } catch (e) {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const direction = useRef('RIGHT');

  // Sound refs
  const moveSound = useRef(new Audio(moveSoundUrl));
  const eatSound = useRef(new Audio(eatSoundUrl));
  const gameOverSound = useRef(new Audio(gameOverSoundUrl));

  useEffect(() => {
    moveSound.current.volume = 0.2; // Make move sound quiet
  }, []);

  const restartGame = () => {
    setSnake(initialSnake);
    setFood(getRandomFood(initialSnake));
    setScore(0);
    direction.current = 'RIGHT';
    setGameOver(false);
  };

  // Save high score when it changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('cyber-snake-highscore', String(score));
      } catch (e) {}
    }
  }, [score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        restartGame();
        return;
      }
      if(gameOver) return;

      let newDirection;
      switch (e.key) {
        case 'ArrowUp':
          if (direction.current !== 'DOWN') newDirection = 'UP';
          break;
        case 'ArrowDown':
          if (direction.current !== 'UP') newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
          if (direction.current !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 'ArrowRight':
          if (direction.current !== 'LEFT') newDirection = 'RIGHT';
          break;
        default:
          return;
      }
      if (newDirection) {
        direction.current = newDirection;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) {
      gameOverSound.current.play().catch(e => console.warn("Error playing sound:", e));
      return;
    }

    const gameInterval = setInterval(() => {
      const snakeHead = { ...snake[0] };
      const newHead = { ...snakeHead };

      switch (direction.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
        default: break;
      }

      // Check for collisions
      if (newHead.x < 0 || newHead.x >= BOARD_SIZE || newHead.y < 0 || newHead.y >= BOARD_SIZE || snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      moveSound.current.play().catch(e => {});

      const newSnake = [newHead, ...snake];
      if (newHead.x === food.x && newHead.y === food.y) {
  eatSound.current.play().catch(e => console.warn('Error playing eat sound', e));
        setFood(getRandomFood(newSnake));
        setScore(prevScore => prevScore + 10);
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);

    }, GAME_SPEED);

    return () => clearInterval(gameInterval);
  }, [snake, food, gameOver]);

  return (
    <div className="game">
      {gameOver ? (
        <div className="game-over">
          <h1>Game Over</h1>
          <h2>Score: {score}</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div className="title-wrap">
              <h1>Cyber Snake</h1>
              <div className="subtitle">Neon retro-future</div>
            </div>
            <div className="hud">
              <div className="score">Score: <span className="score-val">{score}</span></div>
              <div className="highscore">High: <span className="high-val">{highScore}</span></div>
            </div>
          </div>
          <Board snake={snake} food={food} boardSize={BOARD_SIZE} />
        </>
      )}
    </div>
  );
}

export default Game;
