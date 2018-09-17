import Shape, { IShapeOptions } from "./Shape";

export interface IRectOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface IHitbox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export default abstract class Rectangle extends Shape {
  constructor(options: IRectOptions) {
    super(options);
  }

  public get hitbox(): IHitbox {
    const { x, y, width, height } = this;
    const endX = x + width;
    const endY = y + height;

    return {
      left: x < endX ? x : endX,
      right: endX > x ? endX : x,
      top: y < endY ? y : endY,
      bottom: endY > y ? endY : y
    };
  }

  public setStyling(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 1;
    ctx.fillStyle = "salmon";
    ctx.strokeStyle = "brown";
  };

  public drawShape(ctx: CanvasRenderingContext2D): void {
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
  };

  // public abstract prepareStyling(ctx: CanvasRenderingContext2D): void;
}
