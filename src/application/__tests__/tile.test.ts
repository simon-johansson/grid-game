import { IGameLevel } from "../boundaries/input";
import { ITile } from "../boundaries/output";
import GameInteractor, { IPresenters } from "../GameInteractor";
import {
  blockerLayout,
  defaultLayout,
  evaluatedLayout,
  fourMultiTilesLayout,
  getSelectionPresenter,
  getTilePresenter,
  ITileStateLayout,
  networkGatewayMock,
  setSelectionAndEvaluateHelper,
  threeMultiTilesLayout,
  twoMultiTilesLayout,
} from "./testUtils";

const level: IGameLevel = {
  layout: defaultLayout,
  moves: 4,
};
const tileStateLayout: ITileStateLayout = [[], [], [], [], []];
const presenters: IPresenters = {
  selection: getSelectionPresenter(),
  tile: getTilePresenter((tile: ITile) => {
    const { rowIndex, colIndex } = tile.position;
    if (tile.isBlocker) {
      tileStateLayout[rowIndex][colIndex] = "■";
    } else if (tile.isCleared) {
      tileStateLayout[rowIndex][colIndex] = "✔";
    } else {
      tileStateLayout[rowIndex][colIndex] =
        tile.clearsRequired > 1 ? (tile.clearsRequired.toString() as "2" | "3" | "4") : "□";
    }
  }),
};
const game = new GameInteractor(networkGatewayMock);
const setSelectionAndEvaluate = setSelectionAndEvaluateHelper(game);

describe("evaluate selection", () => {
  beforeEach(() => {
    game.startCustomLevel(presenters, level);
  });

  describe("game state", () => {
    describe(".selectionsMade", () => {
      test("returnes number of valid selections", () => {
        const state = setSelectionAndEvaluate([0, 0, 100, 100], [0, 0, 100, 100], [0, 0, 100, 100]);
        expect(state.selections.made.valid).toEqual(3);
        expect(state.selections.made.invalid).toEqual(0);
      });
      test("returnes number of invalid selections", () => {
        game.startCustomLevel(presenters, { layout: blockerLayout });
        const state = setSelectionAndEvaluate([0, 0, 100, 100], [0, 0, 100, 100], [0, 0, 100, 100]);
        expect(state.selections.made.invalid).toEqual(3);
        expect(state.selections.made.valid).toEqual(0);
      });
    });

    describe(".selectionsLeft", () => {
      test("subtract for every valid move made", () => {
        const state = setSelectionAndEvaluate([0, 0, 100, 100], [0, 0, 100, 100], [0, 0, 100, 100]);
        expect(state.selections.left).toEqual(1);
      });
      test("does not subtract for every invalid move made", () => {
        game.startCustomLevel(presenters, { layout: blockerLayout, moves: 4 });
        const state = setSelectionAndEvaluate([0, 0, 100, 100], [0, 0, 100, 100], [0, 0, 100, 100]);
        expect(state.selections.left).toEqual(4);
      });
    });

    describe(".cleared", () => {
      test("returnes false when tiles left to clear", () => {
        const state = setSelectionAndEvaluate([0, 0, 0, 0]);
        expect(state.cleared).toEqual(false);
      });
      test("returnes true when all tiles are cleared", () => {
        const state = setSelectionAndEvaluate([0, 0, 100, 100]);
        expect(state.cleared).toEqual(true);
      });
    });
  });

  describe("regular tiles", () => {
    test("can clear", () => {
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });

    test("can unclear already cleared tiles if toggleOnOverlap is true", () => {
      setSelectionAndEvaluate([0, 0, 100, 100], [0, 0, 80, 80]);
      expect(tileStateLayout).toEqual([
        ["□", "□", "□", "□", "✔"],
        ["□", "□", "□", "□", "✔"],
        ["□", "□", "□", "□", "✔"],
        ["□", "□", "□", "□", "✔"],
        ["✔", "✔", "✔", "✔", "✔"],
      ]);
    });

    test("can not unclear already cleared tiles if toggleOnOverlap is false", () => {
      game.startCustomLevel(presenters, { layout: defaultLayout, rules: { toggleOnOverlap: false } });
      setSelectionAndEvaluate([0, 0, 100, 100], [0, 0, 80, 80]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });
  });

  describe("blocker tiles", () => {
    test("disqualifies answer", () => {
      game.startCustomLevel(presenters, {
        layout: [
          ["r", "r", "r", "r", "r"],
          ["r", "r", "r", "r", "r"],
          ["r", "r", "b", "r", "r"],
          ["r", "r", "r", "r", "r"],
          ["r", "r", "r", "r", "r"],
        ],
      });
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual([
        ["□", "□", "□", "□", "□"],
        ["□", "□", "□", "□", "□"],
        ["□", "□", "■", "□", "□"],
        ["□", "□", "□", "□", "□"],
        ["□", "□", "□", "□", "□"],
      ]);
    });
  });

  describe.skip("multi tiles", () => {
    test("2-tiles requires two selections", () => {
      game.startCustomLevel(presenters, { layout: twoMultiTilesLayout });
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("□"));
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });
    test("3-tiles requires three selections", () => {
      game.startCustomLevel(presenters, { layout: threeMultiTilesLayout });
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("2"));
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("□"));
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });
    test("4-tiles requires four selections", () => {
      game.startCustomLevel(presenters, { layout: fourMultiTilesLayout });
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("3"));
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("2"));
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("□"));
      setSelectionAndEvaluate([0, 0, 100, 100]);
      expect(tileStateLayout).toEqual(evaluatedLayout("✔"));
    });
  });
});
