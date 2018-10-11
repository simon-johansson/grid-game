// import GridPoint from "../Logic/GridPoint";
import Tile, { ITilePresenter } from "../Logic/Tile";
import CanvasProvider from "../Presentation/CanvasProvider";

export default abstract class TilePresenter implements ITilePresenter {
  protected ctx: CanvasRenderingContext2D = CanvasProvider.Instance.TILE_CANVAS_CONTEXT;
  protected size: number = CanvasProvider.Instance.tileSize;

  public render(tile: Tile): void {
    this.ctx.save();
    this.ctx.beginPath();
    this.setCommonStyling(tile);
    this.setStyling(tile);
    this.drawRect(tile);
    this.ctx.restore();
  }

  protected setCommonStyling(tile: Tile): void {
    this.ctx.lineWidth = 5;
  }

  protected abstract setStyling(tile: Tile): void;

  protected drawRect(tile: Tile): void {
    const startX = tile.position.colIndex * this.size;
    const startY = tile.position.rowIndex * this.size;

    this.ctx.rect(startX, startY, this.size, this.size);
    this.ctx.fill();
    this.ctx.stroke();
  }
}
