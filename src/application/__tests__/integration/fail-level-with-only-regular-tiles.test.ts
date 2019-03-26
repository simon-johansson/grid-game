import Interactor, { IPresenters } from "@application/Interactor";
import {
  getAnalyticsMock,
  getNetworkGatewayMock,
  getQuerystringMock,
  getSelectionPresenter,
  getStorageMock,
  getTilePresenter,
  ITileStateLayout,
  setSelectionAndProcessHelper,
} from "@shared/__tests__/testUtils";

const tileStateLayout: ITileStateLayout = [[], [], [], [], []];
const presenters: IPresenters = {
  selection: getSelectionPresenter(),
  tile: getTilePresenter(() => {}, tileStateLayout),
};
const interactor = new Interactor(getNetworkGatewayMock(), getAnalyticsMock(), getStorageMock(), getQuerystringMock());
const setSelectionAndProcess = setSelectionAndProcessHelper(interactor);

describe("fail level with only regular tiles", () => {
  test("start level", () => {
    const state = interactor.startCustomLevel(presenters, {
      layout: [
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
      ],
      moves: 1,
    });

    expect(state.selections.made).toEqual(0);
    expect(state.selections.left).toEqual(1);
    expect(state.isCleared).toEqual(false);
    expect(tileStateLayout).toEqual([
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
    ]);
  });

  test("fail level", () => {
    const state = setSelectionAndProcess([0, 0, 50, 50]);
    expect(state.selections.made).toEqual(1);
    expect(state.selections.left).toEqual(0);
    expect(state.isCleared).toEqual(false);
    expect(tileStateLayout).toEqual([
      ["✔", "✔", "✔", "□", "□"],
      ["✔", "✔", "✔", "□", "□"],
      ["✔", "✔", "✔", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
    ]);
  });
});
