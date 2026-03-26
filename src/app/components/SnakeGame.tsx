import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    animationId: 0,
    lastUpdateTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Generate random food position
    const generateFood = () => {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
          y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
        };
      } while (state.snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
      state.food = newFood;
    };

    // Keyboard handler
    const handleKeyDown = (e: KeyboardEvent) => {
      const { direction, nextDirection } = state;

      if (e.key === 'ArrowUp' && direction.y === 0) {
        state.nextDirection = { x: 0, y: -1 };
      } else if (e.key === 'ArrowDown' && direction.y === 0) {
        state.nextDirection = { x: 0, y: 1 };
      } else if (e.key === 'ArrowLeft' && direction.x === 0) {
        state.nextDirection = { x: -1, y: 0 };
      } else if (e.key === 'ArrowRight' && direction.x === 0) {
        state.nextDirection = { x: 1, y: 0 };
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (timestamp - state.lastUpdateTime < 100) {
        state.animationId = requestAnimationFrame(gameLoop);
        return;
      }
      state.lastUpdateTime = timestamp;

      // Update direction
      state.direction = state.nextDirection;

      // Move snake
      const head = { x: state.snake[0].x + state.direction.x, y: state.snake[0].y + state.direction.y };

      // Check wall collision
      if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE || head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Check self collision
      if (state.snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      state.snake.unshift(head);

      // Check food collision
      if (head.x === state.food.x && head.y === state.food.y) {
        setScore((s) => s + 10);
        generateFood();
      } else {
        state.snake.pop();
      }

      // Draw
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw snake
      state.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#00aa00';
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
      });

      // Draw food
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(state.food.x * GRID_SIZE, state.food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

      state.animationId = requestAnimationFrame(gameLoop);
    };

    state.animationId = requestAnimationFrame(gameLoop);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(state.animationId);
    };
  }, []);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between items-center w-full max-w-lg">
        <h2 className="text-2xl text-green-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          SNAKE
        </h2>
        <div className="text-xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          SCORE: {score}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-green-400 bg-black"
      />

      {gameOver && (
        <div className="text-center space-y-4">
          <div className="text-3xl text-red-500" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            GAME OVER
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 border-2 border-green-400"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}
          >
            RETRY
          </button>
        </div>
      )}

      <div className="text-sm text-gray-400 text-center">
        Use arrow keys to move the snake
      </div>
    </div>
  );
}
