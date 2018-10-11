// import GridPoint from "../Logic/GridPoint";
import CanvasProvider from "../Presentation/CanvasProvider";
import Selection from "../Selection";

interface IPrevRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class SelectionPresenter {
  private ctx: CanvasRenderingContext2D = CanvasProvider.Instance.SELECTION_CANVAS_CONTEXT;
  private tileSize: number = CanvasProvider.Instance.tileSize;
  private prevRect: IPrevRect;

  public render(selection: Selection): void {
    this.clear();
    this.ctx.save();
    this.ctx.beginPath();
    this.setStyling();
    this.drawRect(selection);
    this.ctx.restore();
  }

  public clear() {
    if (this.prevRect) {
      const { x, y, width, height } = this.prevRect;
      this.ctx.clearRect(x - 10, y   - 10, width + 20, height + 20);
    }
  }

  private setStyling() {
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "#000000";
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.lineJoin = "round";
  }

  private drawRect(selection: Selection): void {
    const [startPoint, endPoint] = selection.getGridSpan();
    // console.log(startPoint);
    // console.log(endPoint);
    const startXPx = startPoint.colIndex * this.tileSize;
    const startYPx = startPoint.rowIndex * this.tileSize;
    const width = endPoint.colIndex * this.tileSize - startXPx + this.tileSize;
    const height = endPoint.rowIndex * this.tileSize - startYPx + this.tileSize;

    this.prevRect = {
      x: startXPx,
      y: startYPx,
      width,
      height
    };

    this.ctx.rect(startXPx, startYPx, width, height);
    this.ctx.fill();
    this.ctx.stroke();
  }
}
