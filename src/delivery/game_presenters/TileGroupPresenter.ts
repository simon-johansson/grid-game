import { ITileGroupPresentationData } from "@application/interfaces";
import { tileGroup as styles } from "./presenterStyles";
import { roundRect } from "./presenterUtils";

interface IPrevRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getTileGroupPresenter = (tileGroupContext: () => CanvasRenderingContext2D, tileSize: number) =>
  class TileGroupPresenter {
    private tileSize: number = tileSize;

    public render(tileGroup: ITileGroupPresentationData): void {
      this.ctx.save();
      this.setStyling(tileGroup);
      this.ctx.beginPath();
      this.drawRect(tileGroup);
      this.ctx.closePath();
      this.ctx.restore();
    }

    private get ctx(): CanvasRenderingContext2D {
      return tileGroupContext();
    }

    private setStyling(tileGroup: ITileGroupPresentationData): void {
      this.ctx.lineJoin = "round";
      if (!tileGroup.isCleared) {
        this.styleCommon(tileGroup, styles.notCleared);
      } else {
        this.styleCommon(tileGroup, styles.cleared);
      }
    }

    private styleCommon(tileGroup: ITileGroupPresentationData, style: any): void {
      this.ctx.fillStyle = style.fill;

      if (tileGroup.isSelected) {
        this.ctx.fillStyle = style.selected;
      }
    }

    private drawRect(tileGroup: ITileGroupPresentationData): void {
      if (tileGroup.position !== undefined) {
        const { startTile, endTile } = tileGroup.position;
        const padding = 10;
        const radius = 4;

        const startXPx = startTile.colIndex * this.tileSize + padding;
        const startYPx = startTile.rowIndex * this.tileSize + padding;
        const width = endTile.colIndex * this.tileSize - startXPx + this.tileSize - padding;
        const height = endTile.rowIndex * this.tileSize - startYPx + this.tileSize - padding;

        roundRect(this.ctx, startXPx, startYPx, width, height, radius);

        this.ctx.fill();
        // this.ctx.stroke();
      }
    }
  };

export default getTileGroupPresenter;
