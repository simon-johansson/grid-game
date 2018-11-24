import { ISelection } from "../../domain/boundaries/output";
import CanvasProvider from "../components/GameBoard";
import { selection as styles } from "./presenterStyles";
import { roundRect } from "./presenterUtils";

interface IPrevRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getSelectionPresenter = (selectionContext: () => CanvasRenderingContext2D, tileSize: number) =>
  class SelectionPresenter {
    // private ctx: CanvasRenderingContext2D = ctx;
    private tileSize: number = tileSize;
    private prevRect: IPrevRect;

    public render(selection: ISelection): void {
      this.clear();
      this.ctx.save();
      this.setStyling(selection.isValid);
      this.ctx.beginPath();
      this.drawRect(selection);
      this.ctx.closePath();
      this.ctx.restore();
    }

    public clear() {
      if (this.prevRect) {
        const { x, y, width, height } = this.prevRect;
        this.ctx.clearRect(x - 10, y - 10, width + 20, height + 20);
      }
    }

    private get ctx(): CanvasRenderingContext2D {
      return selectionContext();
    }

    private setStyling(isValid: boolean) {
      this.ctx.lineWidth = 4;
      this.ctx.fillStyle = styles.fill;
      this.ctx.lineJoin = "round";

      if (isValid) {
        this.ctx.strokeStyle = styles.valid.stroke;
      } else {
        this.ctx.strokeStyle = styles.invalid.stroke;
      }
    }

    private drawRect(selection: ISelection): void {
      const { startTile, endTile } = selection.gridSpan;
      const padding = 2;
      const radius = 8;

      const startXPx = startTile.colIndex * this.tileSize + padding;
      const startYPx = startTile.rowIndex * this.tileSize + padding;
      const width = endTile.colIndex * this.tileSize - startXPx + this.tileSize - padding;
      const height = endTile.rowIndex * this.tileSize - startYPx + this.tileSize - padding;

      this.prevRect = {
        x: startXPx,
        y: startYPx,
        width,
        height
      };

      roundRect(this.ctx, startXPx, startYPx, width, height, radius);

      this.ctx.fill();
      this.ctx.stroke();
    }
  };

export default getSelectionPresenter;
