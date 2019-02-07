import { IGameRules, IGridLayout, ITilePresenterConstructor, ITileRawState, TileType } from "./boundaries/input";
import { ITile } from "./boundaries/output";
import GridPoint from "./entities/GridPoint";
import Tile, { IInitState } from "./entities/Tile";

function assertNever(state: never): never {
  throw new Error("Unkown tile state supplied: " + state);
}

export default class TileFactory {
  public static getRawTile(tile: ITile): ITileRawState {
    switch (tile.tileType) {
      case TileType.Regular:
        return "r";

      case TileType.Cleared:
        return "f";

      case TileType.Blocker:
        return "b";
    }
  }

  constructor(private rules: IGameRules, private presenter: ITilePresenterConstructor) {}

  public parseRawTiles(initialBoardLayout: IGridLayout): Tile[] {
    const tiles: Tile[] = [];
    initialBoardLayout.forEach((row, rowIndex) => {
      row.forEach((tileState, colIndex) => {
        const gridPosition = new GridPoint(rowIndex, colIndex);
        const tile = this.create(tileState, gridPosition);
        tiles.push(tile);
      });
    });
    return tiles;
  }

  // TODO: gör inte en switch här, låt Tile.ts sköta det
  private create(initState: ITileRawState, position: GridPoint): Tile {
    let state: IInitState = {};
    let tileType: TileType;

    switch (initState) {
      // r = regular
      case "r":
        tileType = TileType.Regular;
        break;

      // f = flipped
      // TODO: Borde inte vara f för flipped
      case "f":
        tileType = TileType.Cleared;
        state = { cleared: true };
        break;

      // b = blocker
      case "b":
        tileType = TileType.Blocker;
        state = { blocker: true };
        break;

      case "2":
      case "3":
      case "4":
        state = { clearsRequired: parseInt(initState, 10) };
        break;

      default:
        return assertNever(initState);
    }

    // TODO: Ska inte behöva skicka in state när jag skickar in tileType
    return new Tile(tileType, state, position, this.rules, new this.presenter());
  }
}
