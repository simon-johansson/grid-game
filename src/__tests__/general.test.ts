import { IGameLevel, IGridLayout, ISelection, ITile } from "../Logic/boundaries";
import GameInteractor from "../Logic/GameInteractor";

import {
  defaultLayout,
  getSelectionPresenter,
  getTilePresenter,
} from "./testUtils";

const gridSize = 5;
const selectionPresenter = getSelectionPresenter();
const tilePresenter = getTilePresenter();
const game = new GameInteractor(gridSize, selectionPresenter, tilePresenter, tilePresenter, tilePresenter);

describe("level", () => {
  test("level rules gets merged with default rules", () => {
    game.startLevel({
      layout: defaultLayout,
      rules: { minSelection: 4 }
    });
    const { rules } = game.evaluateSelection();
    expect(rules.toggleOnOverlap).toEqual(true);
    expect(rules.minSelection).toEqual(4);
  });
});
