import { GameObject } from "./gameObject"

export class Spike extends GameObject {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red"

    // Draw a triangle for the spike
    ctx.beginPath()
    ctx.moveTo(this.x, this.y + this.height)
    ctx.lineTo(this.x + this.width / 2, this.y)
    ctx.lineTo(this.x + this.width, this.y + this.height)
    ctx.closePath()
    ctx.fill()
  }
}

