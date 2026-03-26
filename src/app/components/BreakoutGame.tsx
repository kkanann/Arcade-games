import { useEffect, useRef, useState } from 'react';

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const gameStateRef = useRef({
    paddle: { x: 0, y: 0, width: 100, height: 10, speed: 8 },
    ball: { x: 0, y: 0, dx: 4, dy: -4, radius: 8 },
    bricks: [] as { x: number; y: number; width: number; height: number; alive: boolean; color: string }[],
    keys: { left: false, right: false },
    animationId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Initialize game
    state.paddle.x = canvas.width / 2 - state.paddle.width / 2;
    state.paddle.y = canvas.height - 30;

    state.ball.x = canvas.width / 2;
    state.ball.y = canvas.height - 50;

    // Create bricks
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 70;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 35;
    const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff'];

    state.bricks = [];
    for (let row = 0; row < brickRowCount; row++) {
      for (let col = 0; col < brickColumnCount; col++) {
        state.bricks.push({
          x: brickOffsetLeft + col * (brickWidth + brickPadding),
          y: brickOffsetTop + row * (brickHeight + brickPadding),
          width: brickWidth,
          height: brickHeight,
          alive: true,
          color: colors[row],
        });
      }
    }

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') state.keys.left = true;
      if (e.key === 'ArrowRight') state.keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') state.keys.left = false;
      if (e.key === 'ArrowRight') state.keys.right = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move paddle
      if (state.keys.left && state.paddle.x > 0) {
        state.paddle.x -= state.paddle.speed;
      }
      if (state.keys.right && state.paddle.x < canvas.width - state.paddle.width) {
        state.paddle.x += state.paddle.speed;
      }

      // Move ball
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Ball collision with walls
      if (state.ball.x + state.ball.radius > canvas.width || state.ball.x - state.ball.radius < 0) {
        state.ball.dx = -state.ball.dx;
      }
      if (state.ball.y - state.ball.radius < 0) {
        state.ball.dy = -state.ball.dy;
      }

      // Ball collision with paddle
      if (
        state.ball.y + state.ball.radius > state.paddle.y &&
        state.ball.x > state.paddle.x &&
        state.ball.x < state.paddle.x + state.paddle.width
      ) {
        state.ball.dy = -state.ball.dy;
        // Add angle based on where ball hits paddle
        const hitPos = (state.ball.x - state.paddle.x) / state.paddle.width;
        state.ball.dx = (hitPos - 0.5) * 8;
      }

      // Ball out of bounds
      if (state.ball.y + state.ball.radius > canvas.height) {
        setGameOver(true);
        return;
      }

      // Ball collision with bricks
      let aliveBricks = 0;
      state.bricks.forEach((brick) => {
        if (!brick.alive) return;
        aliveBricks++;

        if (
          state.ball.x + state.ball.radius > brick.x &&
          state.ball.x - state.ball.radius < brick.x + brick.width &&
          state.ball.y + state.ball.radius > brick.y &&
          state.ball.y - state.ball.radius < brick.y + brick.height
        ) {
          state.ball.dy = -state.ball.dy;
          brick.alive = false;
          setScore((s) => s + 10);
        }
      });

      if (aliveBricks === 0) {
        setGameWon(true);
        return;
      }

      // Draw bricks
      state.bricks.forEach((brick) => {
        if (brick.alive) {
          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.strokeStyle = '#fff';
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
      });

      // Draw paddle
      ctx.fillStyle = '#fff';
      ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      state.animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(state.animationId);
    };
  }, []);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between items-center w-full max-w-2xl">
        <h2 className="text-2xl text-blue-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          BREAKOUT
        </h2>
        <div className="text-xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          SCORE: {score}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border-4 border-blue-400 bg-black"
      />

      {gameOver && (
        <div className="text-center space-y-4">
          <div className="text-3xl text-red-500" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            GAME OVER
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 border-2 border-blue-400"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}
          >
            RETRY
          </button>
        </div>
      )}

      {gameWon && (
        <div className="text-center space-y-4">
          <div className="text-3xl text-green-500" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            YOU WIN!
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 border-2 border-blue-400"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      <div className="text-sm text-gray-400 text-center">
        Use ← → arrow keys to move the paddle
      </div>
    </div>
  );
}
