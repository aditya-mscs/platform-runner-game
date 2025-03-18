import { GameObject } from "./gameObject"

export class Platform extends GameObject {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white"
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

