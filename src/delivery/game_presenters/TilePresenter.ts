import { ITilePresenter } from "../../domain/boundaries/input";
import { ITile } from "../../domain/boundaries/output";
import CanvasProvider from "./CanvasProvider";

export default abstract class TilePresenter implements ITilePresenter {
  protected ctx: CanvasRenderingContext2D = CanvasProvider.Instance.TILE_CANVAS_CONTEXT;
  protected size: number = CanvasProvider.Instance.tileSize;

  public render(tile: ITile): void {
    this.ctx.save();
    this.ctx.beginPath();
    this.setCommonStyling(tile);
    this.setStyling(tile);
    this.drawRect(tile);
    this.drawAdditionalDetails(tile);
    this.ctx.restore();
  }

  protected setCommonStyling(tile: ITile): void {
    this.ctx.lineWidth = 5;
  }

  protected abstract setStyling(tile: ITile): void;

  protected drawRect(tile: ITile): void {
    const startX = tile.position.colIndex * this.size;
    const startY = tile.position.rowIndex * this.size;

    this.ctx.rect(startX, startY, this.size, this.size);
    this.ctx.fill();
    this.ctx.stroke();
  }

  protected drawAdditionalDetails(tile: ITile): void {}
}
