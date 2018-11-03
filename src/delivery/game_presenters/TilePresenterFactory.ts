import { ITile } from "../../domain/boundaries/output";
import TileBlockerPresenter from "./TileBlockerPresenter";
import TileFlippablePresenter from "./TileFlippablePresenter";

export default class TilePresenterFactory {
  public static create(tile: ITile) {
    return tile.isBlocker ? TileBlockerPresenter : TileFlippablePresenter;
  }
}
