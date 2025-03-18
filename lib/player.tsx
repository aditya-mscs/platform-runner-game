import { GameObject } from "./gameObject"

export class Player extends GameObject {
  velocityX = 0
  velocityY = 0
  speed = 5
  jumpForce = 12
  gravity = 0.5
  canJump = false

  constructor(x: number, y: number) {
    super(x, y, 30, 30)
  }

  moveLeft() {
    this.velocityX = -this.speed
  }

  moveRight() {
    this.velocityX = this.speed
  }

  jump() {
    this.velocityY = -this.jumpForce
    this.canJump = false
  }

  update() {
    // Apply gravity
    this.velocityY += this.gravity

    // Apply velocity
    this.x += this.velocityX
    this.y += this.velocityY

    // Friction
    this.velocityX *= 0.9

    // Prevent tiny movement
    if (Math.abs(this.velocityX) < 0.1) {
      this.velocityX = 0
    }
  }

  resolveCollision(other: GameObject) {
    // Calculate overlap on x and y axes
    const overlapX = Math.min(this.x + this.width - other.x, other.x + other.width - this.x)

    const overlapY = Math.min(this.y + this.height - other.y, other.y + other.height - this.y)

    // Resolve collision based on the smallest overlap
    if (overlapX < overlapY) {
      // Horizontal collision
      if (this.x < other.x) {
        this.x = other.x - this.width
      } else {
        this.x = other.x + other.width
      }
      this.velocityX = 0
    } else {
      // Vertical collision
      if (this.y < other.y) {
        this.y = other.y - this.height
        this.velocityY = 0
        this.canJump = true
      } else {
        this.y = other.y + other.height
        this.velocityY = 0
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white"
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

