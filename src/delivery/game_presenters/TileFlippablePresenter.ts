import { ITile } from "../../application/boundaries/output";
import { tileFlippable as styles } from "./presenterStyles";
import TilePresenter from "./TilePresenter";

const getTileFlippablePresenter = (ctx: () => CanvasRenderingContext2D, size: number) =>
  class TileFlippablePresenter extends TilePresenter {
    constructor() {
      super(ctx, size)
    }

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
  };

  export default getTileFlippablePresenter;
