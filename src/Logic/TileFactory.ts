import { IRules } from "./GameBoard";
import { IGameBoardLayout } from "./GameBoard";
import GridPoint from "./GridPoint";
import Tile, { IInitState, ITilePresenterConstructor } from "./Tile";

type ITileState = "r" | "f" | "b";

export default class TileFactory {
  constructor(
    private rules: IRules,
    private defaultPresenter: ITilePresenterConstructor,
    private blockerPresenter?: ITilePresenterConstructor
  ) {}

  public parseRawTiles(initialBoardLayout: IGameBoardLayout): Tile[] {
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

  private create(initState: ITileState, position: GridPoint): Tile {
    let state: IInitState = {};
    let presenter = new this.defaultPresenter();

    switch (initState) {
      // r = regular
      case "r":
        break;

      // f = flipped
      case "f":
        state = { flipped: true };
        break;

      // b = blocker
      case "b":
        state = { blocker: true };
        presenter = new this.blockerPresenter();
        break;

      default:
        throw new Error("Unkown tile state supplied");
    }

    return new Tile(state, position, this.rules, presenter);
  }
}
