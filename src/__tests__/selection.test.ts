import { IGameLevel, ISelection, ITile } from "../Logic/boundaries";
import GameInteractor from "../Logic/GameInteractor";

import {
  defaultLayout,
  evaluatedLayout,
  getSelectionPresenter,
  getTilePresenter,
  ITileSelectionLayout,
  setSelectionHelper
} from "./testUtils";

const gridSize = 5;
const level: IGameLevel = {
  layout: defaultLayout
};
let selection: ISelection;
let selectionPresenterClearFnCalled: boolean = false;
const selectionPresenter = getSelectionPresenter(
  (selectionForPresenter: ISelection) => (selection = selectionForPresenter),
  () => (selectionPresenterClearFnCalled = true)
);
const tileSelectionLayout: ITileSelectionLayout = [[], [], [], [], []];
const tilePresenter = getTilePresenter((tile: ITile) => {
  tileSelectionLayout[tile.position.rowIndex][tile.position.colIndex] = tile.isSelected ? "X" : "O";
});
const game = new GameInteractor(gridSize, selectionPresenter, tilePresenter, tilePresenter, tilePresenter);
const setSelection = setSelectionHelper(game);

describe("tile selection", () => {
  beforeEach(() => {
    game.startLevel(level);
  });

  test("one tile", () => {
    setSelection(0, 0, 0, 0);
    expect(tileSelectionLayout).toEqual([
      ["X", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"]
    ]);
  });

  test("one tile using only #setSelectionStart", () => {
    game.setSelectionStart(1, 1);
    expect(tileSelectionLayout).toEqual([
      ["O", "O", "O", "O", "O"],
      ["O", "X", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"]
    ]);
  });

  test("all tiles", () => {
    setSelection(0, 0, 4, 4);
    expect(tileSelectionLayout).toEqual(evaluatedLayout("X"));
  });

  test("some tiles", () => {
    setSelection(1, 1, 2, 4);
    expect(tileSelectionLayout).toEqual([
      ["O", "O", "O", "O", "O"],
      ["O", "X", "X", "O", "O"],
      ["O", "X", "X", "O", "O"],
      ["O", "X", "X", "O", "O"],
      ["O", "X", "X", "O", "O"]
    ]);
  });

  test("new selection cancels previous selection", () => {
    setSelection(0, 0, 4, 4);
    setSelection(0, 0, 2, 2);
    expect(tileSelectionLayout).toEqual([
      ["X", "X", "X", "O", "O"],
      ["X", "X", "X", "O", "O"],
      ["X", "X", "X", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"]
    ]);
  });

  test("selection canceled after evaluation", () => {
    setSelection(0, 0, 4, 4);
    game.evaluateSelection();
    expect(tileSelectionLayout).toEqual(evaluatedLayout("O"));
  });

  test("selecting from bottom right to top left", () => {
    setSelection(4, 4, 0, 0);
    expect(tileSelectionLayout).toEqual(evaluatedLayout("X"));
  });
});

describe("selection for presenter", () => {
  beforeEach(() => {
    selectionPresenterClearFnCalled = false;
    game.startLevel(level);
  });

  test("#clear() on presenter is called after answer is evaluated", () => {
    setSelection(0, 0, 4, 4);
    expect(selectionPresenterClearFnCalled).toEqual(false);
    game.evaluateSelection();
    expect(selectionPresenterClearFnCalled).toEqual(true);
  });

  describe(".tileSize", () => {
    test("get tile size when grid is 5px", () => {
      const gameSmallerSize = new GameInteractor(5, selectionPresenter, tilePresenter, tilePresenter, tilePresenter);
      gameSmallerSize.startLevel(level);
      gameSmallerSize.setSelectionStart(0, 0);

      expect(selection.tileSize).toEqual(1);
    });

    test("get tile size when grid is 500px", () => {
      const gameBiggerSize = new GameInteractor(500, selectionPresenter, tilePresenter, tilePresenter, tilePresenter);
      gameBiggerSize.startLevel(level);
      gameBiggerSize.setSelectionStart(0, 0);

      expect(selection.tileSize).toEqual(100);
    });
  });

  describe(".isValid", () => {
    test("true when selecting more than minSelection", () => {
      setSelection(0, 0, 0, 0);
      expect(selection.isValid).toEqual(true);
    });

    test("false when selecting less than minSelection", () => {
      game.startLevel({
        layout: defaultLayout,
        rules: {
          minSelection: 4
        }
      });
      setSelection(0, 0, 0, 1);

      expect(selection.isValid).toEqual(false);
    });
  });

  describe(".gridSpan", () => {
    test("one tile when selection has started", () => {
      const gameGridSpan = new GameInteractor(
        gridSize,
        selectionPresenter,
        tilePresenter,
        tilePresenter,
        tilePresenter
      );
      gameGridSpan.startLevel(level);
      gameGridSpan.setSelectionStart(0, 0);

      expect(selection.gridSpan.startTile.rowIndex).toEqual(0);
      expect(selection.gridSpan.startTile.colIndex).toEqual(0);
      expect(selection.gridSpan.endTile.colIndex).toEqual(0);
      expect(selection.gridSpan.endTile.colIndex).toEqual(0);
      expect(selection.gridSpan.tilesSpanned).toEqual(1);
    });

    test("some tiles when selection more then one tile", () => {
      setSelection(1, 1, 4, 4);

      expect(selection.gridSpan.startTile.rowIndex).toEqual(1);
      expect(selection.gridSpan.startTile.colIndex).toEqual(1);
      expect(selection.gridSpan.endTile.colIndex).toEqual(4);
      expect(selection.gridSpan.endTile.colIndex).toEqual(4);
      expect(selection.gridSpan.tilesSpanned).toEqual(16);
    });
  });
});
