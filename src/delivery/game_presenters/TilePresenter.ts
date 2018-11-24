import { ITilePresenter } from "../../domain/boundaries/input";
import { ITile } from "../../domain/boundaries/output";
import CanvasProvider from "../components/GameBoard";
import { roundRect } from "./presenterUtils";

export default abstract class TilePresenter implements ITilePresenter {
  protected padding: number = 10;

  constructor(
    protected context: () => CanvasRenderingContext2D,
    protected size: number
  ) {}

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

  protected get ctx(): CanvasRenderingContext2D {
    return this.context();
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
