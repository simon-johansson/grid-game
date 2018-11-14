import { ITile } from "../../domain/boundaries/output";
import { tileFlippable as styles } from "./presenterStyles";
import TilePresenter from "./TilePresenter";

export default class TileFlippablePresenter extends TilePresenter {
  protected setStyling(tile: ITile): void {
    if (!tile.isCleared) {
      this.styleCommon(tile, styles.notCleared);
    } else {
      this.styleCommon(tile, styles.cleared);
    }
  }

  private styleCommon(tile: ITile, style: any) {
    this.ctx.fillStyle = style.fill;

    if (tile.isSelected) {
      this.ctx.fillStyle = style.selected;
    }
  }
}
