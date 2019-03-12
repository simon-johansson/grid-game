import { ITilePresentationData } from "../../application/interfaces";
import getTileBlockerPresenter from "./TileBlockerPresenter";
import getTileFlippablePresenter from "./TileFlippablePresenter";
import TilePresenter from "./TilePresenter";

const getTilePresenter = (ctx: () => CanvasRenderingContext2D, size: number) =>
  class TilePresenterHandler {
    public render(tile: ITilePresentationData): void {
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
