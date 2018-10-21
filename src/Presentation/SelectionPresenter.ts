// import GridPoint from "../Logic/GridPoint";
import Selection from "../Logic/Selection";
import CanvasProvider from "../Presentation/CanvasProvider";

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
    this.setStyling(selection.isValid);
    this.drawRect(selection);
    this.ctx.restore();
  }

  public clear() {
    if (this.prevRect) {
      const { x, y, width, height } = this.prevRect;
      this.ctx.clearRect(x - 10, y - 10, width + 20, height + 20);
    }
  }

  private setStyling(isValid: boolean) {
    this.ctx.lineWidth = 5;
    if (!isValid) {
      this.ctx.strokeStyle = "#EECED1";
    } else {
      this.ctx.strokeStyle = "#000000";
    }
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.lineJoin = "round";
  }

  private drawRect(selection: Selection): void {
    const { startTile, endTile } = selection.gridSpan;
    const startXPx = startTile.colIndex * this.tileSize;
    const startYPx = startTile.rowIndex * this.tileSize;
    const width = endTile.colIndex * this.tileSize - startXPx + this.tileSize;
    const height = endTile.rowIndex * this.tileSize - startYPx + this.tileSize;

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
