import Circle from "./Circle";

export default class ObligatoryMarking extends Circle {
  public prepareStyling(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
  }
}
