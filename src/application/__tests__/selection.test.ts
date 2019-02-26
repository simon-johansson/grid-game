import { ISelectionPresentationData } from "../../domain/Selection";
import { ITilePresentationData } from "../../domain/Tile";
import GameInteractor, { IPresenters } from "../GameInteractor";
import { IGameLevel } from "../interfaces";
import {
  blockerLayout,
  defaultLayout,
  evaluatedLayout,
  getSelectionPresenter,
  getTilePresenter,
  ITileSelectionLayout,
  networkGatewayMock,
  setSelectionHelper,
} from "./testUtils";

const level: IGameLevel = {
  layout: defaultLayout,
};
let selection: ISelectionPresentationData;
let selectionPresenterClearFnCalled: boolean = false;
const tileSelectionLayout: ITileSelectionLayout = [[], [], [], [], []];
const presenters: IPresenters = {
  selection: getSelectionPresenter(
    (selectionForPresenter: ISelectionPresentationData) => (selection = selectionForPresenter),
    () => (selectionPresenterClearFnCalled = true),
  ),
  tile: getTilePresenter((tile: ITilePresentationData) => {
    tileSelectionLayout[tile.position.rowIndex][tile.position.colIndex] = tile.isSelected ? "X" : "O";
  }),
};
const game = new GameInteractor(networkGatewayMock);
const setSelection = setSelectionHelper(game);

describe("tile selection", () => {
  beforeEach(() => {
    game.startCustomLevel(presenters, level);
  });

  test("one tile", () => {
    setSelection(0, 0, 0, 0);
    expect(tileSelectionLayout).toEqual([
      ["X", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
    ]);
  });

  test("one tile using only #setSelectionStart", () => {
    game.setSelectionStart(30, 30);
    expect(tileSelectionLayout).toEqual([
      ["O", "O", "O", "O", "O"],
      ["O", "X", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
    ]);
  });

  test("all tiles", () => {
    setSelection(0, 0, 100, 100);
    expect(tileSelectionLayout).toEqual(evaluatedLayout("X"));
  });

  test("some tiles", () => {
    setSelection(30, 30, 50, 100);
    expect(tileSelectionLayout).toEqual([
      ["O", "O", "O", "O", "O"],
      ["O", "X", "X", "O", "O"],
      ["O", "X", "X", "O", "O"],
      ["O", "X", "X", "O", "O"],
      ["O", "X", "X", "O", "O"],
    ]);
  });

  test("new selection cancels previous selection", () => {
    setSelection(0, 0, 100, 100);
    setSelection(0, 0, 50, 50);
    expect(tileSelectionLayout).toEqual([
      ["X", "X", "X", "O", "O"],
      ["X", "X", "X", "O", "O"],
      ["X", "X", "X", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
    ]);
  });

  test("selection canceled after evaluation", () => {
    setSelection(0, 0, 100, 100);
    game.processSelection();
    expect(tileSelectionLayout).toEqual(evaluatedLayout("O"));
  });

  test("selecting from bottom right to top left", () => {
    setSelection(100, 100, 0, 0);
    expect(tileSelectionLayout).toEqual(evaluatedLayout("X"));
  });
});

describe("selection for presenter", () => {
  beforeEach(() => {
    selectionPresenterClearFnCalled = false;
    game.startCustomLevel(presenters, level);
  });

  test("#clear() on presenter is called after answer is evaluated", () => {
    setSelection(0, 0, 100, 100);
    expect(selectionPresenterClearFnCalled).toEqual(false);
    game.processSelection();
    expect(selectionPresenterClearFnCalled).toEqual(true);
  });

  // describe(".tileSize", () => {
  //   test("get tile size when grid is 5px", () => {
  //     const gameSmallerSize = new GameInteractor(5, selectionPresenter, tilePresenter, tilePresenter, tilePresenter);
  //     gameSmallerSize.startLevel(level);
  //     gameSmallerSize.setSelectionStart(0, 0);

  //     expect(selection.tileSize).toEqual(1);
  //   });

  //   test("get tile size when grid is 500px", () => {
  //     const gameBiggerSize = new GameInteractor(500, selectionPresenter, tilePresenter, tilePresenter, tilePresenter);
  //     gameBiggerSize.startLevel(level);
  //     gameBiggerSize.setSelectionStart(0, 0);

  //     expect(selection.tileSize).toEqual(100);
  //   });
  // });

  describe(".isValid", () => {
    test("true when selecting more than minSelection", () => {
      setSelection(0, 0, 0, 0);
      expect(selection.isValid).toEqual(true);
    });

    test("false when selecting less than minSelection", () => {
      game.startCustomLevel(presenters, {
        layout: defaultLayout,
        rules: {
          minSelection: 4,
        },
      });
      setSelection(0, 0, 0, 20);

      expect(selection.isValid).toEqual(false);
    });

    test("false when selecting a disqualifying tile", () => {
      game.startCustomLevel(presenters, { layout: blockerLayout });
      setSelection(0, 0, 100, 100);

      expect(selection.isValid).toEqual(false);
    });
  });

  describe(".gridSpan", () => {
    test("one tile when selection has started", () => {
      const gameGridSpan = new GameInteractor(networkGatewayMock);
      gameGridSpan.startCustomLevel(presenters, level);
      gameGridSpan.setSelectionStart(0, 0);

      expect(selection.gridSpan.startTile.rowIndex).toEqual(0);
      expect(selection.gridSpan.startTile.colIndex).toEqual(0);
      expect(selection.gridSpan.endTile.colIndex).toEqual(0);
      expect(selection.gridSpan.endTile.colIndex).toEqual(0);
      expect(selection.gridSpan.tilesSpanned).toEqual(1);
    });

    test("some tiles when selection more then one tile", () => {
      setSelection(30, 30, 100, 100);

      expect(selection.gridSpan.startTile.rowIndex).toEqual(1);
      expect(selection.gridSpan.startTile.colIndex).toEqual(1);
      expect(selection.gridSpan.endTile.colIndex).toEqual(4);
      expect(selection.gridSpan.endTile.colIndex).toEqual(4);
      expect(selection.gridSpan.tilesSpanned).toEqual(16);
    });
  });
});
