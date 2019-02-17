import { IGameLevel, IGridLayout } from "../boundaries/input";
import { ISelection, ITile } from "../boundaries/output";
import GameInteractor from "../GameInteractor";

import {
  defaultLayout,
  getSelectionPresenter,
  getTilePresenter,
} from "./testUtils";

const selectionPresenter = getSelectionPresenter();
const tilePresenter = getTilePresenter();
const game = new GameInteractor(selectionPresenter, tilePresenter);

describe("level", () => {
  test("level rules gets merged with default rules", () => {
    game.startCustomLevel({
      layout: defaultLayout,
      rules: { minSelection: 4 }
    });
    const { rules } = game.evaluateSelection();
    expect(rules.toggleOnOverlap).toEqual(true);
    expect(rules.minSelection).toEqual(4);
  });
});

describe.skip("TODO", () => {
  test("startCurrentLevel", () => {});
  test("startNextLevel", () => {});
  test("startPrevLevel", () => {});
  test("startCustomLevel", () => {});
});
