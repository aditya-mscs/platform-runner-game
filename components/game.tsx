"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { levels } from "@/lib/levels"
import { Player } from "@/lib/player"
import { Platform } from "@/lib/platform"
import { Spike } from "@/lib/spike"
import { Goal } from "@/lib/goal"

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [levelComplete, setLevelComplete] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [resetCounter, setResetCounter] = useState(0)
  const [showLevelSelect, setShowLevelSelect] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([0]) // Start with level 1 unlocked for testing
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [maxPlayerX, setMaxPlayerX] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setLevelComplete(false)
    setGameComplete(false)
    setShowLevelSelect(false)
    setMaxPlayerX(0)
    setCurrentProgress(0)
    setPointsEarned(0)
    setResetCounter((prev) => prev + 1)
  }

  const restartLevel = () => {
    // Calculate points based on progress before restarting
    const progressPoints = Math.min(Math.floor(currentProgress * 5), 4)

    // Only add points if we made some progress and haven't already completed this level
    if (progressPoints > 0 && !completedLevels.includes(currentLevel)) {
      setTotalPoints((prev) => prev + progressPoints)
      setPointsEarned(progressPoints)
    } else {
      setPointsEarned(0)
    }

    setGameOver(false)
    setLevelComplete(false)
    setMaxPlayerX(0)
    setCurrentProgress(0)
    setResetCounter((prev) => prev + 1)
    setGameStarted(true)
  }

  const nextLevel = () => {
    // Award 5 points for completing the level if not already completed
    if (!completedLevels.includes(currentLevel)) {
      setTotalPoints((prev) => prev + 5)
      setPointsEarned(5)
    } else {
      setPointsEarned(0)
    }

    if (currentLevel < levels.length - 1) {
      // Mark current level as completed if not already
      if (!completedLevels.includes(currentLevel)) {
        setCompletedLevels((prev) => [...prev, currentLevel])
      }

      setCurrentLevel((prev) => prev + 1)
      setLevelComplete(false)
      setMaxPlayerX(0)
      setCurrentProgress(0)
      setResetCounter((prev) => prev + 1)
      setGameStarted(true)
    } else {
      // Mark final level as completed
      if (!completedLevels.includes(currentLevel)) {
        setCompletedLevels((prev) => [...prev, currentLevel])
      }
      setGameComplete(true)
    }
  }

  const goToTitle = () => {
    // Calculate points based on progress before going to title
    if (!completedLevels.includes(currentLevel)) {
      const progressPoints = Math.min(Math.floor(currentProgress * 5), 4)
      if (progressPoints > 0) {
        setTotalPoints((prev) => prev + progressPoints)
        setPointsEarned(progressPoints)
      } else {
        setPointsEarned(0)
      }
    } else {
      setPointsEarned(0)
    }

    setGameStarted(false)
    setGameOver(false)
    setGameComplete(false)
    setShowLevelSelect(false)
    setMaxPlayerX(0)
    setCurrentProgress(0)
  }

  const openLevelSelect = () => {
    setShowLevelSelect(true)
  }

  const selectLevel = (levelIndex: number) => {
    setCurrentLevel(levelIndex)
    setGameStarted(true)
    setGameOver(false)
    setLevelComplete(false)
    setGameComplete(false)
    setShowLevelSelect(false)
    setMaxPlayerX(0)
    setCurrentProgress(0)
    setPointsEarned(0)
    setResetCounter((prev) => prev + 1)
  }

  // Calculate level progress based on player's horizontal position
  const calculateProgress = (playerX: number, levelWidth: number) => {
    // Update max player X position
    if (playerX > maxPlayerX) {
      setMaxPlayerX(playerX)
    }

    // Calculate progress as a percentage (0-1)
    const progress = Math.max(maxPlayerX, playerX) / levelWidth
    setCurrentProgress(progress)

    return progress
  }

  // Generate level positions for zigzag path
  const getLevelPositions = () => {
    const positions = []
    const rows = Math.ceil(levels.length / 3)

    for (let i = 0; i < rows; i++) {
      const isRightToLeft = i % 2 === 1 // First row is left to right
      const rowStart = i * 3
      const rowEnd = Math.min(rowStart + 3, levels.length)

      for (let j = rowStart; j < rowEnd; j++) {
        const col = isRightToLeft ? rowEnd - 1 - j + rowStart : j - rowStart
        positions.push({ level: j, row: i, col })
      }
    }

    return positions
  }

  const levelPositions = getLevelPositions()

  // Generate SVG path for zigzag
  const generateZigzagPath = () => {
    const rows = Math.ceil(levels.length / 3)
    let path = `M 60 50` // Start at first level

    // First row: left to right
    path += ` L 175 50 L 290 50`

    if (rows > 1) {
      // Connect to second row
      path += ` L 290 150`

      // Second row: right to left
      path += ` L 175 150 L 60 150`

      if (rows > 2) {
        // Connect to third row
        path += ` L 60 250`

        // Third row: left to right
        path += ` L 175 250 L 290 250`
      }
    }

    return path
  }

  useEffect(() => {
    if (!gameStarted) return

    let animationFrameId: number

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 500

    // Initialize game objects
    const level = levels[currentLevel]
    const player = new Player(level.playerStart.x, level.playerStart.y)
    const platforms = level.platforms.map((p) => new Platform(p.x, p.y, p.width, p.height))
    const spikes = level.spikes.map((s) => new Spike(s.x, s.y, s.width, s.height))
    const goal = new Goal(level.goal.x, level.goal.y, level.goal.width, level.goal.height)

    // Game state
    const keys: { [key: string]: boolean } = {}

    // Key event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Handle input
      if (keys["ArrowLeft"] || keys["a"]) {
        player.moveLeft()
      }
      if (keys["ArrowRight"] || keys["d"]) {
        player.moveRight()
      }
      if ((keys[" "] || keys["ArrowUp"] || keys["w"]) && player.canJump) {
        player.jump()
      }

      // Update player
      player.update()

      // Calculate progress
      calculateProgress(player.x, canvas.width)

      // Check platform collisions
      player.canJump = false
      for (const platform of platforms) {
        if (player.checkCollision(platform)) {
          player.resolveCollision(platform)
        }
      }

      // Check spike collisions
      for (const spike of spikes) {
        if (player.checkCollision(spike)) {
          // Calculate points earned before game over
          if (!completedLevels.includes(currentLevel)) {
            const progressPoints = Math.min(Math.floor(currentProgress * 5), 4)
            setPointsEarned(progressPoints)
          }
          setGameOver(true)
          return
        }
      }

      // Check goal collision
      if (player.checkCollision(goal)) {
        // Calculate points earned for level completion
        if (!completedLevels.includes(currentLevel)) {
          setPointsEarned(5)
        }
        setLevelComplete(true)
        return
      }

      // Check if player fell off the map
      if (player.y > canvas.height) {
        // Calculate points earned before game over
        if (!completedLevels.includes(currentLevel)) {
          const progressPoints = Math.min(Math.floor(currentProgress * 5), 4)
          setPointsEarned(progressPoints)
        }
        setGameOver(true)
        return
      }

      // Draw game objects
      for (const platform of platforms) {
        platform.draw(ctx)
      }

      for (const spike of spikes) {
        spike.draw(ctx)
      }

      goal.draw(ctx)
      player.draw(ctx)

      // Draw points and progress
      ctx.fillStyle = "white"
      ctx.font = "16px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Total Points: ${totalPoints}`, 20, 30)

      // Draw progress if level not already completed
      if (!completedLevels.includes(currentLevel)) {
        const progressPoints = Math.min(Math.floor(currentProgress * 5), 4)
        ctx.fillText(`Level Progress: ${Math.round(currentProgress * 100)}%`, 20, 60)
        ctx.fillText(`Current Points: +${progressPoints}`, 20, 90)
      }

      // Continue animation loop if game is still running
      if (!gameOver && !levelComplete) {
        animationFrameId = requestAnimationFrame(gameLoop)
      }
    }

    // Start game loop
    gameLoop()

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      cancelAnimationFrame(animationFrameId)
    }
  }, [gameStarted, currentLevel, resetCounter, completedLevels])

  // Update total points when game over
  useEffect(() => {
    if (gameOver && !completedLevels.includes(currentLevel) && pointsEarned > 0) {
      setTotalPoints((prev) => prev + pointsEarned)
    }
  }, [gameOver, currentLevel, completedLevels, pointsEarned])

  return (
    <div className="flex flex-col items-center">
      {!gameStarted && !gameComplete && !showLevelSelect && (
        <div className="mb-4 flex flex-col items-center">
          <h2 className="mb-4 text-2xl text-white">PLATRUNNER - Level {currentLevel + 1}</h2>
          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-xl text-white">Total Points: {totalPoints}</p>
            {pointsEarned > 0 && <p className="text-green-400">+{pointsEarned} points from last attempt!</p>}
          </div>
          <div className="flex flex-col space-y-3">
            <Button onClick={startGame} className="bg-white text-black hover:bg-gray-200">
              Start Game
            </Button>
            <Button onClick={openLevelSelect} className="bg-gray-700 text-white hover:bg-gray-600">
              Level Select
            </Button>
          </div>
        </div>
      )}

      {showLevelSelect && (
        <div className="mb-4 flex flex-col items-center">
          <h2 className="mb-4 text-2xl text-white">PLATRUNNER - Select Level</h2>
          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-xl text-white">Total Points: {totalPoints}</p>
            {pointsEarned > 0 && <p className="text-green-400">+{pointsEarned} points from last attempt!</p>}
          </div>

          {/* Level selection with zigzag path */}
          <div className="relative w-[350px] h-[300px] mb-4">
            {/* Draw the zigzag path */}
            <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d={generateZigzagPath()}
                stroke="#2563EB"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={completedLevels.length < levels.length ? "10,10" : "none"}
              />
            </svg>

            {/* Level buttons positioned along the path */}
            {levelPositions.map(({ level, row, col }) => (
              <div
                key={level}
                className="absolute"
                style={{
                  top: `${row * 100 + 30}px`,
                  left: `${col * 115 + 40}px`,
                  zIndex: 10,
                }}
              >
                <Button
                  onClick={() => selectLevel(level)}
                  disabled={!completedLevels.includes(level) && level !== 0}
                  className={`w-16 h-16 rounded-full ${
                    completedLevels.includes(level)
                      ? "bg-green-600 hover:bg-green-700"
                      : level === 0
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {level + 1}
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={goToTitle} className="bg-gray-700 text-white hover:bg-gray-600">
            Back
          </Button>
        </div>
      )}

      {gameOver && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded bg-black p-6 text-center">
          <h2 className="mb-4 text-2xl text-white">Game Over</h2>
          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-white">Progress: {Math.round(currentProgress * 100)}%</p>
            <p className="text-white">
              Points earned: <span className="text-green-400">+{pointsEarned}</span>
            </p>
            <p className="text-white mt-2">Total Points: {totalPoints}</p>
          </div>
          <div className="flex flex-col space-y-3">
            <Button onClick={restartLevel} className="bg-white text-black hover:bg-gray-200">
              Try Again
            </Button>
            <Button onClick={goToTitle} className="bg-gray-700 text-white hover:bg-gray-600">
              Back to Title
            </Button>
          </div>
        </div>
      )}

      {levelComplete && !gameComplete && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded bg-black p-6 text-center">
          <h2 className="mb-4 text-2xl text-white">Level Complete!</h2>
          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-white">
              Points earned: <span className="text-green-400">+{pointsEarned}</span>
            </p>
            <p className="text-white mt-2">Total Points: {totalPoints}</p>
          </div>
          <Button onClick={nextLevel} className="bg-white text-black hover:bg-gray-200">
            Next Level
          </Button>
        </div>
      )}

      {gameComplete && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded bg-black p-6 text-center">
          <h2 className="mb-4 text-2xl text-white">Congratulations!</h2>
          <p className="mb-4 text-white">You completed PLATRUNNER!</p>
          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-xl text-white">Total Points: {totalPoints}</p>
            {pointsEarned > 0 && <p className="text-green-400">+{pointsEarned} points from last level!</p>}
          </div>
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => {
                setCurrentLevel(0)
                setGameComplete(false)
                setGameStarted(false)
              }}
              className="bg-white text-black hover:bg-gray-200"
            >
              Play Again
            </Button>
            <Button onClick={goToTitle} className="bg-gray-700 text-white hover:bg-gray-600">
              Back to Title
            </Button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="border border-white bg-black"
        style={{ display: gameStarted ? "block" : "none" }}
      />
    </div>
  )
}

