import GridPoint from "../Logic/GridPoint";
import Tile from "../Logic/Tile";
import TilePresenter from "./TilePresenter";

export default class TileMultiFlipPresenter extends TilePresenter {
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

  protected setStyling(tile: Tile): void {
    if (!tile.isFlipped) {
      this.styleDefault(tile);
    } else {
      this.styleFlipped(tile);
    }
  }

  protected drawAdditionalDetails(tile: Tile): void {
    if (tile.flippesLeft > 1) {
      const x = (tile.position.colIndex * this.size) + (this.size / 2);
      const y = (tile.position.rowIndex * this.size) + (this.size / 2);

      this.ctx.fillStyle = "black";
      this.ctx.font = "30px Arial";
      this.ctx.fillText(`${tile.flippesLeft}`, x, y);
    }
  }

  private styleDefault(tile: Tile) {
    this.ctx.fillStyle = this.defaultStyles.fill;
    this.ctx.strokeStyle = this.defaultStyles.stroke;

    if (tile.isSelected && tile.flippesLeft === 1) {
      this.ctx.fillStyle = this.defaultStyles.selected.fill;
    }
  }

  private styleFlipped(tile: Tile) {
    this.ctx.fillStyle = this.fllippedStyles.fill;
    this.ctx.strokeStyle = this.fllippedStyles.stroke;

    if (tile.isSelected) {
      this.ctx.fillStyle = this.fllippedStyles.selected.fill;
    }
  }
}
