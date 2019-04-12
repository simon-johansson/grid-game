import Interactor, { IPresenters } from "@application/Interactor";
import { IGameLevel } from "@application/interfaces";
import Rules from "@domain/Rules";
import {
  getAnalyticsMock,
  getInstallerMock,
  getNetworkGatewayMock,
  getQuerystringMock,
  getSelectionPresenter,
  getStorageMock,
  getTilePresenter,
  ITileStateLayout,
  processedLayout,
  setSelectionAndProcessHelper,
} from "@shared/__tests__/testUtils";

const tileStateLayout: ITileStateLayout = [[], [], [], [], []];
const presenters: IPresenters = {
  selection: getSelectionPresenter(),
  tile: getTilePresenter(() => {}, tileStateLayout),
};
const levels: IGameLevel[] = [
  {
    layout: [
      ["r", "r", "r", "r", "r"],
      ["r", "f", "f", "f", "r"],
      ["r", "f", "f", "f", "r"],
      ["r", "f", "f", "f", "r"],
      ["r", "r", "r", "r", "r"],
    ],
    moves: 2,
    rules: new Rules(),
  },
];
const interactor = new Interactor(
  getNetworkGatewayMock(levels),
  getAnalyticsMock(),
  getStorageMock(),
  getQuerystringMock(),
  getInstallerMock(),
);
const setSelectionAndProcess = setSelectionAndProcessHelper(interactor);

describe("unclear already cleared tiles", () => {
  beforeAll(async done => {
    await interactor.loadLevels();
    done();
  });

  test("start level", () => {
    interactor.startCurrentLevel(presenters);
  });

  test("make a selection that unclears cleared tiles", () => {
    setSelectionAndProcess([0, 0, 100, 100]);
    expect(tileStateLayout).toEqual([
      ["✔", "✔", "✔", "✔", "✔"],
      ["✔", "□", "□", "□", "✔"],
      ["✔", "□", "□", "□", "✔"],
      ["✔", "□", "□", "□", "✔"],
      ["✔", "✔", "✔", "✔", "✔"],
    ]);
  });

  test("clear level", () => {
    const state = setSelectionAndProcess([20, 20, 75, 75]);
    expect(state.isCleared).toEqual(true);
    expect(tileStateLayout).toEqual(processedLayout("✔"));
  });
});
