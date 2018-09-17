import GameBoard from "../GameBoard";
import Selection from "../Selection";
import { gameBoardLayouts } from "../gameBoardSetup";

const GAME_BOARD_ROWS = 5;
const GAME_BOARD_COLS = 5;
let selection: Selection;
let gameBoard: GameBoard;

/**
 * @param {[number, number]}  startTile - [column, row]
 * @param {[number, number]}  endTile - [column, row]
 */
const select = (startTile: [number, number], endTile: [number, number]) => {
  const tileToPx = (tile: number) => tile * 100 - 50;

  selection.start(tileToPx(startTile[0]), tileToPx(startTile[1]));
  selection.move(tileToPx(endTile[0]), tileToPx(endTile[1]));
  gameBoard.setSelection(selection);
};

const translateTiles = (layout: any[]) => {
  const newLayout: any[] = [[], [], [], [], []];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      // console.log(layout[row][col]);
      switch (layout[row][col]) {
        case "□":
          newLayout[row][col] = "r";
          break;
        case "✔":
          newLayout[row][col] = "f";
          break;
        case "■":
          newLayout[row][col] = "b";
          break;
      }
    }
  }
  return newLayout;
};

describe("", () => {
  beforeEach(() => {
    selection = new Selection();
    gameBoard = new GameBoard(
      [
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "b", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"]
      ],
      GAME_BOARD_ROWS,
      GAME_BOARD_COLS,
      500,
      500,
      {
        toggleOnOverlap: true
      }
    );
  });
  test("select flippable tiles", () => {
    select([1, 1], [5, 2]);
    const move = gameBoard.evaluateSelection(selection);
    const extectedLayout = translateTiles([
      ["✔", "✔", "✔", "✔", "✔"],
      ["✔", "✔", "✔", "✔", "✔"],
      ["□", "□", "■", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"]
    ]);
    expect(move.validMove).toBeTruthy();
    expect(move.layout).toEqual(extectedLayout);
  });

  test("invalidate move when selecting blocked tile", () => {
    select([1, 1], [5, 5]);
    const move = gameBoard.evaluateSelection(selection);
    const extectedLayout = translateTiles([
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "■", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"]
    ]);
    expect(move.validMove).toBeFalsy();
    expect(move.layout).toEqual(extectedLayout);
  });
});
