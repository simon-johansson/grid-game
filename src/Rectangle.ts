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

  public prepareDraw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    this.prepareStyling(ctx);
    ctx.rect(this.x, this.y, this.width, this.height);
  };

  public abstract prepareStyling(ctx: CanvasRenderingContext2D): void;
}
