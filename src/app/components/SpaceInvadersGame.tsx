import { useEffect, useRef, useState } from 'react';

export function SpaceInvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const gameStateRef = useRef({
    player: { x: 0, y: 0, width: 40, height: 30, speed: 6 },
    bullets: [] as { x: number; y: number; width: number; height: number }[],
    invaders: [] as { x: number; y: number; width: number; height: number; alive: boolean }[],
    invaderDirection: 1,
    invaderSpeed: 1,
    keys: { left: false, right: false, space: false },
    canShoot: true,
    animationId: 0,
    lastUpdateTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Initialize player
    state.player.x = canvas.width / 2 - state.player.width / 2;
    state.player.y = canvas.height - 50;

    // Create invaders
    const rows = 4;
    const cols = 8;
    const invaderWidth = 30;
    const invaderHeight = 30;
    const padding = 20;
    const offsetTop = 50;
    const offsetLeft = 60;

    state.invaders = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        state.invaders.push({
          x: offsetLeft + col * (invaderWidth + padding),
          y: offsetTop + row * (invaderHeight + padding),
          width: invaderWidth,
          height: invaderHeight,
          alive: true,
        });
      }
    }

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') state.keys.left = true;
      if (e.key === 'ArrowRight') state.keys.right = true;
      if (e.key === ' ') {
        e.preventDefault();
        state.keys.space = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') state.keys.left = false;
      if (e.key === 'ArrowRight') state.keys.right = false;
      if (e.key === ' ') state.keys.space = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Game loop
    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - state.lastUpdateTime;
      
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move player
      if (state.keys.left && state.player.x > 0) {
        state.player.x -= state.player.speed;
      }
      if (state.keys.right && state.player.x < canvas.width - state.player.width) {
        state.player.x += state.player.speed;
      }

      // Shoot bullet
      if (state.keys.space && state.canShoot) {
        state.bullets.push({
          x: state.player.x + state.player.width / 2 - 2,
          y: state.player.y,
          width: 4,
          height: 15,
        });
        state.canShoot = false;
        setTimeout(() => {
          state.canShoot = true;
        }, 300);
      }

      // Move bullets
      state.bullets = state.bullets.filter((bullet) => {
        bullet.y -= 8;
        return bullet.y > 0;
      });

      // Move invaders
      if (deltaTime > 500) {
        state.lastUpdateTime = timestamp;
        
        // Check if any invader hit the edge
        let hitEdge = false;
        state.invaders.forEach((invader) => {
          if (invader.alive) {
            if (
              (state.invaderDirection > 0 && invader.x + invader.width >= canvas.width - 10) ||
              (state.invaderDirection < 0 && invader.x <= 10)
            ) {
              hitEdge = true;
            }
          }
        });

        if (hitEdge) {
          state.invaderDirection *= -1;
          state.invaders.forEach((invader) => {
            if (invader.alive) {
              invader.y += 20;
              // Check if invaders reached the player
              if (invader.y + invader.height >= state.player.y) {
                setGameOver(true);
              }
            }
          });
        } else {
          state.invaders.forEach((invader) => {
            if (invader.alive) {
              invader.x += state.invaderDirection * 20;
            }
          });
        }
      }

      // Check bullet collisions
      state.bullets.forEach((bullet) => {
        state.invaders.forEach((invader) => {
          if (
            invader.alive &&
            bullet.x < invader.x + invader.width &&
            bullet.x + bullet.width > invader.x &&
            bullet.y < invader.y + invader.height &&
            bullet.y + bullet.height > invader.y
          ) {
            invader.alive = false;
            bullet.y = -100; // Remove bullet
            setScore((s) => s + 10);
          }
        });
      });

      // Check if all invaders are dead
      const aliveInvaders = state.invaders.filter((inv) => inv.alive).length;
      if (aliveInvaders === 0) {
        setGameWon(true);
        return;
      }

      // Draw invaders
      state.invaders.forEach((invader) => {
        if (invader.alive) {
          ctx.fillStyle = '#0f0';
          ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
          
          // Draw simple alien face
          ctx.fillStyle = '#000';
          ctx.fillRect(invader.x + 8, invader.y + 8, 4, 4);
          ctx.fillRect(invader.x + 18, invader.y + 8, 4, 4);
          ctx.fillRect(invader.x + 10, invader.y + 20, 10, 2);
        }
      });

      // Draw player
      ctx.fillStyle = '#fff';
      ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);
      ctx.fillRect(state.player.x + 15, state.player.y - 10, 10, 10); // Turret

      // Draw bullets
      ctx.fillStyle = '#ff0';
      state.bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      state.animationId = requestAnimationFrame(gameLoop);
    };

    state.animationId = requestAnimationFrame(gameLoop);

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
        <h2 className="text-2xl text-purple-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          INVADERS
        </h2>
        <div className="text-xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          SCORE: {score}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border-4 border-purple-400 bg-black"
      />

      {gameOver && (
        <div className="text-center space-y-4">
          <div className="text-3xl text-red-500" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            GAME OVER
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 border-2 border-purple-400"
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
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 border-2 border-purple-400"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      <div className="text-sm text-gray-400 text-center">
        Use ← → arrow keys to move | SPACE to shoot
      </div>
    </div>
  );
}
