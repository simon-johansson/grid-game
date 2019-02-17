import { ITile } from "../../application/boundaries/output";
import CanvasProvider from "../components/GameBoard";
import TilePresenter from "./TilePresenter";

const getTileBlockerPresenter = (ctx: () => CanvasRenderingContext2D, size: number) =>
  class TileBlockerPresenter extends TilePresenter {
    private styles = {
      fill: "#EECED1",
      stroke: "#ffffff",
      selected: {
        fill: "#ff0000"
      }
    };

    constructor() {
      super(ctx, size)
    }

    protected setStyling(tile: ITile): void {
      this.ctx.fillStyle = this.styles.fill;
      this.ctx.strokeStyle = this.styles.stroke;

      if (tile.isSelected) {
        this.ctx.fillStyle = this.styles.selected.fill;
      }
    }
  };

export default getTileBlockerPresenter;
