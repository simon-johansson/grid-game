import { IGameLevel, IGridLayout, ISelection, ITile } from "../Logic/boundaries";
import GameInteractor from "../Logic/GameInteractor";

import {
  blockerLayout,
  defaultLayout,
  evaluatedLayout,
  fourMultiTilesLayout,
  getSelectionPresenter,
  getTilePresenter,
  ITileStateLayout,
  mixedLayout,
  setSelectionAndEvaluateHelper,
  threeMultiTilesLayout,
  twoMultiTilesLayout
} from "./testUtils";

const gridSize = 5;
const level: IGameLevel = {
  layout: defaultLayout,
  moves: 4
};
const selectionPresenter = getSelectionPresenter();
const tileStateLayout: ITileStateLayout = [[], [], [], [], []];
const tilePresenter = getTilePresenter((tile: ITile) => {
  const { rowIndex, colIndex } = tile.position;
  if (tile.isBlocker) {
    tileStateLayout[rowIndex][colIndex] = "■";
  } else if (tile.isCleared) {
    tileStateLayout[rowIndex][colIndex] = "✔";
  } else {
    tileStateLayout[rowIndex][colIndex] =
      tile.clearsRequired > 1 ? (tile.clearsRequired.toString() as "2" | "3" | "4") : "□";
  }
});
const game = new GameInteractor(gridSize, selectionPresenter, tilePresenter, tilePresenter, tilePresenter);
const setSelectionAndEvaluate = setSelectionAndEvaluateHelper(game);

describe("evaluate selection", () => {
  beforeEach(() => {
    game.startLevel(level);
  });

  describe("game state", () => {
    describe(".selectionsMade", () => {
      test("returnes number of valid selections", () => {
        const state = setSelectionAndEvaluate([0, 0, 0, 0], [1, 1, 2, 2], [3, 1, 4, 4]);
        expect(state.selectionsMade.valid).toEqual(3);
        expect(state.selectionsMade.invalid).toEqual(0);
      });
      test("returnes number of invalid selections", () => {
        game.startLevel({ layout: blockerLayout });
        const state = setSelectionAndEvaluate([0, 0, 0, 0], [1, 1, 2, 2], [3, 1, 4, 4]);
        expect(state.selectionsMade.invalid).toEqual(3);
        expect(state.selectionsMade.valid).toEqual(0);
      });
    });

    describe(".selectionsLeft", () => {
      test("subtract for every valid move made", () => {
        const state = setSelectionAndEvaluate([0, 0, 0, 0], [1, 1, 2, 2], [3, 1, 4, 4]);
        expect(state.selectionsLeft).toEqual(1);
      });
      test("does not subtract for every invalid move made", () => {
        game.startLevel({ layout: blockerLayout, moves: 4 });
        const state = setSelectionAndEvaluate([0, 0, 0, 0], [1, 1, 2, 2], [3, 1, 4, 4]);
        expect(state.selectionsLeft).toEqual(4);
      });
    });

    describe(".cleared", () => {
      test("returnes false when tiles left to clear", () => {
        const state = setSelectionAndEvaluate([0, 0, 0, 0]);
        expect(state.cleared).toEqual(false);
      });
      test("returnes true when all tiles are cleared", () => {
        const state = setSelectionAndEvaluate([0, 0, 4, 4]);
        expect(state.cleared).toEqual(true);
      });
    });
  });

  describe("regular tiles", () => {
    test("can clear", () => {
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });

    test("can unclear already cleared tiles if toggleOnOverlap is true", () => {
      setSelectionAndEvaluate([0, 0, 4, 4], [0, 0, 3, 3]);
      expect(tileStateLayout).toEqual([
        ["□", "□", "□", "□", "✔"],
        ["□", "□", "□", "□", "✔"],
        ["□", "□", "□", "□", "✔"],
        ["□", "□", "□", "□", "✔"],
        ["✔", "✔", "✔", "✔", "✔"]
      ]);
    });

    test("can not unclear already cleared tiles if toggleOnOverlap is false", () => {
      game.startLevel({ layout: defaultLayout, rules: { toggleOnOverlap: false } });
      setSelectionAndEvaluate([0, 0, 4, 4], [0, 0, 3, 3]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });
  });

  describe("blocker tiles", () => {
    test("disqualifies answer", () => {
      game.startLevel({ layout: mixedLayout });
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual([
        ["✔", "2", "3", "4", "■"],
        ["□", "□", "□", "□", "□"],
        ["□", "□", "□", "□", "□"],
        ["□", "□", "□", "□", "□"],
        ["□", "□", "□", "□", "□"]
      ]);
    });
  });

  describe("multi tiles", () => {
    test("2-tiles requires two selections", () => {
      game.startLevel({ layout: twoMultiTilesLayout });
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("□"));
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });
    test("3-tiles requires three selections", () => {
      game.startLevel({ layout: threeMultiTilesLayout });
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("2"));
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("□"));
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });
    test("4-tiles requires four selections", () => {
      game.startLevel({ layout: fourMultiTilesLayout });
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("3"));
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("2"));
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("□"));
      setSelectionAndEvaluate([0, 0, 4, 4]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });
  });
});
