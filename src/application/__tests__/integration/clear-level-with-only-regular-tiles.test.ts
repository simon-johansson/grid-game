import {
  getAnalyticsMock,
  getNetworkGatewayMock,
  getSelectionPresenter,
  getStorageMock,
  getTilePresenter,
  ITileSelectionLayout,
  ITileStateLayout,
  processedLayout,
  setSelectionAndProcessHelper,
  setSelectionHelper,
} from "@shared/__tests__/testUtils";
import Interactor, { IPresenters } from "../../Interactor";
import { ISelectionPresentationData } from "../../interfaces";

let selectionData: ISelectionPresentationData;
const tileSelectionLayout: ITileSelectionLayout = [[], [], [], [], []];
const tileStateLayout: ITileStateLayout = [[], [], [], [], []];
const presenters: IPresenters = {
  selection: getSelectionPresenter(data => {
    selectionData = data;
  }),
  tile: getTilePresenter(() => {}, tileStateLayout, tileSelectionLayout),
};
const interactor = new Interactor(getNetworkGatewayMock(), getAnalyticsMock(), getStorageMock());
const setSelectionAndProcess = setSelectionAndProcessHelper(interactor);
const setSelection = setSelectionHelper(interactor);

describe("clear level with only regular tiles", () => {
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

  test("select whole grid", () => {
    setSelection(0, 0, 100, 100);
    const { startTile, endTile } = selectionData.tileSpan;
    expect(startTile.rowIndex).toEqual(0);
    expect(startTile.colIndex).toEqual(0);
    expect(endTile.rowIndex).toEqual(4);
    expect(endTile.colIndex).toEqual(4);
    expect(selectionData.isValid).toEqual(true);
    expect(tileSelectionLayout).toEqual([
      ["X", "X", "X", "X", "X"],
      ["X", "X", "X", "X", "X"],
      ["X", "X", "X", "X", "X"],
      ["X", "X", "X", "X", "X"],
      ["X", "X", "X", "X", "X"],
    ]);
  });

  test("clear level", () => {
    const state = interactor.processSelection();
    expect(state.selections.made).toEqual(1);
    expect(state.selections.left).toEqual(0);
    expect(state.isCleared).toEqual(true);
    expect(tileStateLayout).toEqual(processedLayout("✔"));
  });
});
