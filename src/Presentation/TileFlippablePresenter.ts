import GridPoint from "../Logic/GridPoint";
import Tile from "../Logic/Tile";
import TilePresenter from "./TilePresenter";

export default class TileFlippablePresenter extends TilePresenter {
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
    if (!tile.isCleared) {
      this.styleDefault(tile);
    } else {
      this.styleFlipped(tile);
    }
  }

  private styleDefault(tile: Tile) {
    this.ctx.fillStyle = this.defaultStyles.fill;
    this.ctx.strokeStyle = this.defaultStyles.stroke;

    if (tile.isSelected) {
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
