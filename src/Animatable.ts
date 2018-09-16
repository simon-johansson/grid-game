export interface IAnimateOptions {
  originX: number;
  originY: number;
  rotate: [number, number];
  pixelPerFrame: number;
}

export default class Animatable {
  private state: number;
  private target: number;

  public setAnimation(options: IAnimateOptions) {
    ctx.translate(options.originX, options.originY);
    ctx.rotate((this.state * Math.PI) / 180);
  }

  public animate(options: IAnimateOptions, ctx: CanvasRenderingContext2D) {
    this.calculateState();
    ctx.translate(options.originX, options.originY);
    ctx.rotate((this.state * Math.PI) / 180);
  }

  private calculateState() {
    if (this.state < this.target) {
      ++this.state;
    } else if (this.state > this.target) {
      --this.state;
    } else {
      this.target = this.target === -3 ? 3 : -3;
    }
  }
}
