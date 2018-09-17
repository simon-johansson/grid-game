import Rectangle from "./Rectangle";

interface IStartPosition {
  x: number;
  y: number;
}

export default class Selection extends Rectangle {
  private startPosition: IStartPosition;
  private mouseDown: boolean = false;

  constructor() {
    super({ x: 0, y: 0, width: 0, height: 0 });
    this.shouldDraw = false;
  }

  public start(mouseX: number, mouseY: number): void {
    this.startPosition = { x: mouseX, y: mouseY };
    this.mouseDown = true;
  }

  public move(mouseX: number, mouseY: number): void {
    if (this.mouseDown) {
      const { x, y } = this.startPosition;
      this.setCharacteristics({ x, y, width: mouseX - x, height: mouseY - y });
      this.shouldDraw = true;
    }
  }

  public stop(): void {
    this.mouseDown = false;
    this.shouldDraw = false;
  }

  public setStyling(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
  }
}
