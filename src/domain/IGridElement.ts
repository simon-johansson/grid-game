import TileSpan from "./TileSpan";

import { TileType } from "./Tile";

export default interface IGridElement {
  applySelection: (selection: TileSpan, tileType?: TileType) => void;
  toggleCleared: () => void;
  deselect: () => void;
}
