import Shape, { IShapeOptions } from "./Shape";

export default abstract class Circle extends Shape {

  constructor(centerX: number, centerY: number, radius: number) {
    super({
      x: centerX,
      y: centerY,
      radius
    })
  }

  public prepareDraw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    this.prepareStyling(ctx);
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  };

  public abstract prepareStyling(ctx: CanvasRenderingContext2D): void;
}


