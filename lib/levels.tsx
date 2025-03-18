export const levels = [
  {
    playerStart: { x: 50, y: 400 },
    platforms: [
      { x: 0, y: 450, width: 300, height: 50 },
      { x: 400, y: 450, width: 400, height: 50 },
      { x: 500, y: 350, width: 100, height: 20 },
      { x: 650, y: 250, width: 100, height: 20 },
    ],
    spikes: [{ x: 300, y: 430, width: 100, height: 20 }],
    goal: { x: 700, y: 200, width: 30, height: 50 },
  },
  {
    // Redesigned level 2
    playerStart: { x: 50, y: 350 },
    platforms: [
      // Starting platform
      { x: 0, y: 400, width: 150, height: 30 },

      // Middle platforms in zigzag pattern
      { x: 200, y: 350, width: 80, height: 20 },
      { x: 330, y: 280, width: 80, height: 20 },
      { x: 460, y: 350, width: 80, height: 20 },

      // Bottom platforms with spikes between
      { x: 250, y: 450, width: 100, height: 30 },
      { x: 450, y: 450, width: 100, height: 30 },

      // Final platform with goal
      { x: 600, y: 300, width: 150, height: 30 },

      // Extra platforms for alternative routes
      { x: 150, y: 200, width: 70, height: 20 },
      { x: 350, y: 150, width: 70, height: 20 },
      { x: 550, y: 200, width: 70, height: 20 },
    ],
    spikes: [
      // Spikes between bottom platforms
      { x: 350, y: 430, width: 100, height: 20 },

      // Spikes on sides of platforms
      { x: 280, y: 330, width: 50, height: 20 },
      { x: 410, y: 330, width: 50, height: 20 },

      // Spikes near ceiling to prevent cheese
      { x: 250, y: 100, width: 100, height: 20 },
      { x: 450, y: 100, width: 100, height: 20 },

      // Spike trap near goal
      { x: 600, y: 280, width: 30, height: 20 },
    ],
    goal: { x: 700, y: 250, width: 30, height: 50 },
  },
  {
    // Completely redesigned level 3
    playerStart: { x: 50, y: 50 },
    platforms: [
      // Starting platform
      { x: 0, y: 100, width: 120, height: 20 },

      // Descending platforms on the right
      { x: 170, y: 150, width: 80, height: 20 },
      { x: 300, y: 200, width: 80, height: 20 },
      { x: 430, y: 250, width: 80, height: 20 },

      // Central vertical platforms
      { x: 250, y: 350, width: 100, height: 20 },
      { x: 400, y: 400, width: 100, height: 20 },

      // Platforms leading to goal
      { x: 550, y: 350, width: 80, height: 20 },
      { x: 650, y: 300, width: 80, height: 20 },
      { x: 550, y: 250, width: 80, height: 20 },

      // Bottom safety platform
      { x: 100, y: 450, width: 200, height: 30 },

      // Extra challenge platforms
      { x: 350, y: 100, width: 60, height: 20 },
      { x: 500, y: 150, width: 60, height: 20 },
      { x: 650, y: 150, width: 60, height: 20 },
    ],
    spikes: [
      // Top spikes
      { x: 120, y: 80, width: 50, height: 20 },

      // Middle spikes
      { x: 250, y: 180, width: 50, height: 20 },
      { x: 380, y: 230, width: 50, height: 20 },

      // Bottom spikes
      { x: 300, y: 430, width: 100, height: 20 },
      { x: 500, y: 430, width: 100, height: 20 },

      // Spike traps near goal path
      { x: 630, y: 280, width: 20, height: 20 },
      { x: 630, y: 330, width: 20, height: 20 },

      // Extra challenge spikes
      { x: 410, y: 80, width: 90, height: 20 },
      { x: 560, y: 130, width: 90, height: 20 },
    ],
    goal: { x: 700, y: 400, width: 30, height: 50 },
  },
]

