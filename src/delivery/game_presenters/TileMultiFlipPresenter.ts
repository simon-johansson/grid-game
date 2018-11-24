import { ITile } from "../../domain/boundaries/output";
import TilePresenter from "./TilePresenter";

const getTileMultiFlipPresenter = (ctx: () => CanvasRenderingContext2D, size: number) =>
  class TileMultiFlipPresenter extends TilePresenter {
    private defaultStyles = {
      fill: "#EFEFEF",
      stroke: "#ffffff",
      selected: {
        fill: "#D1F2D2"
      }
    };
    private fllippedStyles = {
      fill: "#D1F2D2",
      stroke: "#ffffff",
      selected: {
        fill: "#EFEFEF"
      }
    };

    constructor() {
      super(ctx, size)
    }

    protected setStyling(tile: ITile): void {
      if (!tile.isCleared) {
        this.styleDefault(tile);
      } else {
        this.styleFlipped(tile);
      }
    }

    protected drawAdditionalDetails(tile: ITile): void {
      if (tile.clearsRequired > 1) {
        const x = tile.position.colIndex * this.size + this.size / 2;
        const y = tile.position.rowIndex * this.size + this.size / 2;

        this.ctx.fillStyle = "black";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(`${tile.clearsRequired}`, x, y);
      }
    }

    private styleDefault(tile: ITile) {
      this.ctx.fillStyle = this.defaultStyles.fill;
      this.ctx.strokeStyle = this.defaultStyles.stroke;

      if (tile.isSelected && tile.clearsRequired === 1) {
        this.ctx.fillStyle = this.defaultStyles.selected.fill;
      }
    }

    private styleFlipped(tile: ITile) {
      this.ctx.fillStyle = this.fllippedStyles.fill;
      this.ctx.strokeStyle = this.fllippedStyles.stroke;

      if (tile.isSelected) {
        this.ctx.fillStyle = this.fllippedStyles.selected.fill;
      }
    }
  };

  export default getTileMultiFlipPresenter;
