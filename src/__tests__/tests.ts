// import GameBoard, { IGameBoardLayout } from "../Logic/GameBoard";
// import GridPoint from "../Logic/GridPoint";
// import Tile from "../Logic/Tile";

// describe("game logic", () => {
//   let gameBoard: GameBoard;
//   const defaultLayout: IGameBoardLayout = [
//     ["r", "r", "r", "r", "r"],
//     ["r", "r", "r", "r", "r"],
//     ["r", "r", "b", "r", "r"],
//     ["r", "r", "r", "r", "r"],
//     ["r", "r", "r", "r", "r"]
//   ];
//   const defaultSettings = {
//     toggleOnOverlap: true
//   };

//   beforeEach(() => {
//     // gameBoard = new GameBoard(defaultLayout, defaultSettings);
//   });

//   describe("select tiles", () => {
//     let selectionLayout: Array<Array<"X" | "O">>;
//     const tileRender = {
//       render: (tile: Tile) => {
//         selectionLayout[tile.position.rowIndex][tile.position.colIndex] = tile.isSelected ? "X" : "O";
//       }
//     };

//     beforeEach(() => {
//       selectionLayout = [[], [], [], [], []];
//       gameBoard = new GameBoard(defaultLayout, defaultSettings, tileRender);
//     });

//     test("all tiles", () => {
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(4, 4)]);
//       expect(selectionLayout).toEqual([
//         ["X", "X", "X", "X", "X"],
//         ["X", "X", "X", "X", "X"],
//         ["X", "X", "X", "X", "X"],
//         ["X", "X", "X", "X", "X"],
//         ["X", "X", "X", "X", "X"]
//       ]);
//     });
//     test("some tiles", () => {
//       gameBoard.setSelection([new GridPoint(1, 1), new GridPoint(4, 2)]);
//       expect(selectionLayout).toEqual([
//         ["O", "O", "O", "O", "O"],
//         ["O", "X", "X", "O", "O"],
//         ["O", "X", "X", "O", "O"],
//         ["O", "X", "X", "O", "O"],
//         ["O", "X", "X", "O", "O"]
//       ]);
//     });
//     test("one tile", () => {
//       gameBoard.setSelection([new GridPoint(1, 1), new GridPoint(1, 1)]);
//       expect(selectionLayout).toEqual([
//         ["O", "O", "O", "O", "O"],
//         ["O", "X", "O", "O", "O"],
//         ["O", "O", "O", "O", "O"],
//         ["O", "O", "O", "O", "O"],
//         ["O", "O", "O", "O", "O"]
//       ]);
//     });
//     test("new selection cancels previous selection", () => {
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(4, 4)]);
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(2, 2)]);
//       expect(selectionLayout).toEqual([
//         ["X", "X", "X", "O", "O"],
//         ["X", "X", "X", "O", "O"],
//         ["X", "X", "X", "O", "O"],
//         ["O", "O", "O", "O", "O"],
//         ["O", "O", "O", "O", "O"]
//       ]);
//     });
//     test("selection canceled after evaluation", () => {
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(4, 4)]);
//       gameBoard.evaluateSelection();
//       expect(selectionLayout).toEqual([
//         ["O", "O", "O", "O", "O"],
//         ["O", "O", "O", "O", "O"],
//         ["O", "O", "O", "O", "O"],
//         ["O", "O", "O", "O", "O"],
//         ["O", "O", "O", "O", "O"]
//       ]);
//     });
//   });

//   describe("evaluate selection", () => {
//     let stateLayout: Array<Array<"■" | "✔" | "□">>;
//     const tileRender = {
//       render: (tile: Tile) => {
//         const { rowIndex, colIndex } = tile.position;
//         if (tile.isBlocker) {
//           stateLayout[rowIndex][colIndex] = "■";
//         } else if (tile.isFlipped) {
//           stateLayout[rowIndex][colIndex] = "✔";
//         } else {
//           stateLayout[rowIndex][colIndex] = "□";
//         }
//       }
//     };

//     beforeEach(() => {
//       stateLayout = [[], [], [], [], []];
//       gameBoard = new GameBoard(defaultLayout, defaultSettings, tileRender);
//     });

//     test("can flip flippable tiles", () => {
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(1, 4)]);
//       gameBoard.evaluateSelection();
//       expect(stateLayout).toEqual([
//         ["✔", "✔", "✔", "✔", "✔"],
//         ["✔", "✔", "✔", "✔", "✔"],
//         ["□", "□", "■", "□", "□"],
//         ["□", "□", "□", "□", "□"],
//         ["□", "□", "□", "□", "□"]
//       ]);
//     });
//     test("can flip same tiles multiple times", () => {
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(1, 4)]);
//       gameBoard.evaluateSelection();
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(1, 1)]);
//       gameBoard.evaluateSelection();
//       expect(stateLayout).toEqual([
//         ["□", "□", "✔", "✔", "✔"],
//         ["□", "□", "✔", "✔", "✔"],
//         ["□", "□", "■", "□", "□"],
//         ["□", "□", "□", "□", "□"],
//         ["□", "□", "□", "□", "□"]
//       ]);
//     });
//     test("can do multiple flips", () => {
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(1, 4)]);
//       gameBoard.evaluateSelection();
//       gameBoard.setSelection([new GridPoint(2, 0), new GridPoint(4, 1)]);
//       gameBoard.evaluateSelection();
//       expect(stateLayout).toEqual([
//         ["✔", "✔", "✔", "✔", "✔"],
//         ["✔", "✔", "✔", "✔", "✔"],
//         ["✔", "✔", "■", "□", "□"],
//         ["✔", "✔", "□", "□", "□"],
//         ["✔", "✔", "□", "□", "□"]
//       ]);
//     });
//     test("disqualifies selection of blocker", () => {
//       gameBoard.setSelection([new GridPoint(0, 0), new GridPoint(4, 4)]);
//       gameBoard.evaluateSelection();
//       expect(stateLayout).toEqual([
//         ["□", "□", "□", "□", "□"],
//         ["□", "□", "□", "□", "□"],
//         ["□", "□", "■", "□", "□"],
//         ["□", "□", "□", "□", "□"],
//         ["□", "□", "□", "□", "□"]
//       ]);
//     });
//   });
// });
