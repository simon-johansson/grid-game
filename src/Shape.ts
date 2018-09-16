import Animatable, { IAnimateOptions } from "./Animatable";
import applyMixins from "./applyMixins";
import Drawable from "./Drawable";

export interface IShapeOptions {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
}

abstract class Shape implements Drawable {
  public draw: (ctx: CanvasRenderingContext2D) => void;
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

  public abstract prepareDraw(ctx: CanvasRenderingContext2D): void;

  protected setCharacteristics(options: IShapeOptions) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.radius = options.radius;
  }
}

applyMixins(Shape, [Drawable, Animatable]);
export default Shape;
