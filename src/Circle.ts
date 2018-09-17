import Shape, { IShapeOptions } from "./Shape";

export default abstract class Circle extends Shape {

  constructor(centerX: number, centerY: number, radius: number) {
    super({
      x: centerX,
      y: centerY,
      radius
    })
  }

  public setStyling(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 1;
    ctx.fillStyle = "salmon";
    ctx.strokeStyle = "brown";
  };

  public drawShape(ctx: CanvasRenderingContext2D): void {
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  };

  // public abstract prepareStyling(ctx: CanvasRenderingContext2D): void;
}


