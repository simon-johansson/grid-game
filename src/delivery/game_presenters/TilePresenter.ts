import { ITilePresenter } from "../../domain/boundaries/input";
import { ITile } from "../../domain/boundaries/output";
import CanvasProvider from "./CanvasProvider";
import { roundRect } from "./presenterUtils";

export default abstract class TilePresenter implements ITilePresenter {
  protected ctx: CanvasRenderingContext2D = CanvasProvider.Instance.TILE_CANVAS_CONTEXT;
  protected size: number = CanvasProvider.Instance.tileSize;
  protected padding: number = 10;

  public render(tile: ITile): void {
    this.ctx.save();
    this.setCommonStyling(tile);
    this.setStyling(tile);
    this.ctx.beginPath();
    this.drawRect(tile);
    this.ctx.closePath();
    this.drawAdditionalDetails(tile);
    this.ctx.restore();
  }

  protected setCommonStyling(tile: ITile): void {
    this.ctx.lineJoin = "round";
  }

  protected abstract setStyling(tile: ITile): void;

  protected drawRect(tile: ITile): void {
    const startX = (tile.position.colIndex * this.size) + this.padding;
    const startY = (tile.position.rowIndex * this.size) + this.padding;
    const size = this.size - (this.padding * 2);
    const radius = 4;

    roundRect(this.ctx, startX, startY, size, size, radius);
    this.ctx.fill();
  }

  protected drawAdditionalDetails(tile: ITile): void {}
}
