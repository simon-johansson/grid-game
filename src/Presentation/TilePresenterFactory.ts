import Tile from "../Logic/Tile";
import TileBlockerPresenter from "./TileBlockerPresenter";
import TileFlippablePresenter from "./TileFlippablePresenter";

export default class TilePresenterFactory {
  public static create(tile: Tile) {
    return tile.isBlocker ? TileBlockerPresenter : TileFlippablePresenter;
  }
}
