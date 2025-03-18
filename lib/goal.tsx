import { GameObject } from "./gameObject"

export class Goal extends GameObject {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green"
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

