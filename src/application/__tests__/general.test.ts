import GameInteractor from "../GameInteractor";
import { defaultLayout, networkGatewayMock, presenters } from "./testUtils";


const game = new GameInteractor(networkGatewayMock);

describe("level", () => {
  test("level rules gets merged with default rules", () => {
    game.startCustomLevel(presenters, {
      layout: defaultLayout,
      rules: { minSelection: 4 },
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
