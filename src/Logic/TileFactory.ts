import { IGameRules, IGridLayout, ITilePresenterConstructor, ITileRawState } from "./boundaries";
import GridPoint from "./GridPoint";
import Tile, { IInitState } from "./Tile";

export default class TileFactory {
  constructor(
    private rules: IGameRules,
    private defaultPresenter: ITilePresenterConstructor,
    private blockerPresenter?: ITilePresenterConstructor,
    private multiFlipPresenter?: ITilePresenterConstructor
  ) {}

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

  private create(initState: ITileRawState, position: GridPoint): Tile {
    let state: IInitState = {};
    let presenter = new this.defaultPresenter();

    switch (initState) {
      // r = regular
      case "r":
        break;

      // f = flipped
      case "f":
        state = { cleared: true };
        break;

      // b = blocker
      case "b":
        state = { blocker: true };
        presenter = new this.blockerPresenter();
        break;

      case "2":
      case "3":
      case "4":
        state = { clearsRequired: parseInt(initState, 10) };
        presenter = new this.multiFlipPresenter();
        break;

      default:
        throw new Error("Unkown tile state supplied");
    }

    return new Tile(state, position, this.rules, presenter);
  }
}
