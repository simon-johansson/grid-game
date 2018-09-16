export default class Drawable {
  public shouldDraw: boolean;
  public prepareDraw: (ctx: CanvasRenderingContext2D) => void;

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.shouldDraw) {
      ctx.save();
      this.prepareDraw(ctx);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }
}
