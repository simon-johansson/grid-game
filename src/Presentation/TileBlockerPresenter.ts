import GridPoint from "../Logic/GridPoint";
import Tile from "../Logic/Tile";
import TilePresenter from "./TilePresenter";

export default class TileBlockerPresenter extends TilePresenter {
  private styles = {
    fill: "#EECED1",
    stroke: "#ffffff",
    selected: {
      fill: "#ff0000"
    }
  };

  protected setStyling(tile: Tile): void {
    this.ctx.fillStyle = this.styles.fill;
    this.ctx.strokeStyle = this.styles.stroke;

    if (tile.isSelected) {
      this.ctx.fillStyle = this.styles.selected.fill;
    }
  }
}
