import { ITile } from "../../application/boundaries/output";
import getTileBlockerPresenter from "./TileBlockerPresenter";
import getTileFlippablePresenter from "./TileFlippablePresenter";
import getTileMultiFlipPresenter from "./TileMultiFlipPresenter";
import TilePresenter from "./TilePresenter";

const getTilePresenter = (ctx: () => CanvasRenderingContext2D, size: number) =>
  class TilePresenterHandler {
    public render(tile: ITile): void {
      let presenterGetter;
      let presenter: TilePresenter;
      if (tile.isBlocker) {
        presenterGetter = getTileBlockerPresenter(ctx, size);
      } else {
        presenterGetter = getTileFlippablePresenter(ctx, size);
      }
      presenter = new presenterGetter();
      presenter.render(tile);
    }
  };

export default getTilePresenter;
