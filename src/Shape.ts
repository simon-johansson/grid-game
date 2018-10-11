import Animatable, { IAnimateOptions } from "./Animatable";

export interface IShapeOptions {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
}

export default abstract class Shape {
  public animate: (options: IAnimateOptions, ctx: CanvasRenderingContext2D) => void;
  public shouldDraw: boolean = true;
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected radius: number;

  constructor(options: IShapeOptions) {
    this.setCharacteristics(options);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.shouldDraw) {
      ctx.save();
      ctx.beginPath();
      this.setStyling(ctx);
      this.drawShape(ctx);
      ctx.restore();
    }
  }

  public abstract setStyling(ctx: CanvasRenderingContext2D): void;

  public abstract drawShape(ctx: CanvasRenderingContext2D): void;

  protected setCharacteristics(options: IShapeOptions) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.radius = options.radius;
  }
}
