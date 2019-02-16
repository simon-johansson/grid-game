import { IGridLayout, ITileRawState, ITypedGridLayout, TileType } from "./boundaries/input";
import { ITile } from "./boundaries/output";

// TODO: Använd denna fallback
function assertNever(state: never): never {
  throw new Error("Unkown tile state supplied: " + state);
}

export const getTypedLayout = (layout: IGridLayout): ITypedGridLayout => {
  return layout.map(row => row.map(getTypedTile));
};

export const getMinifiedLayout = (tiles: ITile[]): IGridLayout => {
  const layout: IGridLayout = [];
  tiles.forEach(tile => {
    const { rowIndex, colIndex } = tile.position;
    layout[rowIndex] = layout[rowIndex] || [];
    layout[rowIndex][colIndex] = getMinifiedTile(tile);
  });
  return layout;
};

const getTypedTile = (tileMinified: ITileRawState): TileType => {
  switch (tileMinified) {
    case "r":
      return TileType.Regular;
    // TODO: Borde inte vara f för flipped
    case "f":
    return TileType.Cleared;
    case "b":
    return TileType.Blocker;
    // default:
    //   return assertNever(tileState);
  }
};

const getMinifiedTile = (tile: ITile): ITileRawState => {
  switch (tile.tileType) {
    case TileType.Regular:
    return "r";
    case TileType.Cleared:
      return "f";
    case TileType.Blocker:
      return "b";
    // default:
    //   return assertNever(tileState);
  }
};
