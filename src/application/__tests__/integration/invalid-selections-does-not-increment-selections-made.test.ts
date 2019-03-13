import Interactor, { IPresenters } from "@application/Interactor";
import { ISelectionPresentationData } from "@application/interfaces";
import Rules from "@domain/Rules";
import {
  getAnalyticsMock,
  getNetworkGatewayMock,
  getSelectionPresenter,
  getStorageMock,
  getTilePresenter,
  ITileSelectionLayout,
  ITileStateLayout,
  setSelectionAndProcessHelper,
  setSelectionHelper,
} from "@shared/__tests__/testUtils";

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

describe("invalid selections does not increment selections made", () => {
  test("start level", () => {
    interactor.startCustomLevel(presenters, {
      layout: [
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "b", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
      ],
      moves: 4,
      rules: new Rules({ minSelection: 2 }),
    });
  });

  test("make a valid selection", () => {
    const state = setSelectionAndProcess([0, 0, 100, 20]);

    expect(state.selections.made).toEqual(1);
    expect(state.selections.left).toEqual(3);
    expect(state.isCleared).toEqual(false);
    expect(tileStateLayout).toEqual([
      ["✔", "✔", "✔", "✔", "✔"],
      ["✔", "✔", "✔", "✔", "✔"],
      ["□", "□", "■", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
    ]);
  });

  test("make invalid selection (select blocker tile)", () => {
    setSelection(0, 40, 100, 100);
    expect(selectionData.isValid).toEqual(false);
    expect(tileSelectionLayout).toEqual([
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["X", "X", "X", "X", "X"],
      ["X", "X", "X", "X", "X"],
      ["X", "X", "X", "X", "X"],
    ]);

    const state = interactor.processSelection();

    expect(state.selections.made).toEqual(1);
    expect(state.selections.left).toEqual(3);
    expect(state.isCleared).toEqual(false);
    expect(tileStateLayout).toEqual([
      ["✔", "✔", "✔", "✔", "✔"],
      ["✔", "✔", "✔", "✔", "✔"],
      ["□", "□", "■", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
    ]);
  });

  test("make invalid selection (under min selection rule)", () => {
    setSelection(0, 0, 10, 10);
    expect(selectionData.isValid).toEqual(false);
    expect(tileSelectionLayout).toEqual([
      ["X", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
      ["O", "O", "O", "O", "O"],
    ]);

    const state = interactor.processSelection();

    expect(state.selections.made).toEqual(1);
    expect(state.selections.left).toEqual(3);
    expect(state.isCleared).toEqual(false);
    expect(tileStateLayout).toEqual([
      ["✔", "✔", "✔", "✔", "✔"],
      ["✔", "✔", "✔", "✔", "✔"],
      ["□", "□", "■", "□", "□"],
      ["□", "□", "□", "□", "□"],
      ["□", "□", "□", "□", "□"],
    ]);
  });

  test("clear level", () => {
    const state = setSelectionAndProcess([0, 40, 20, 100], [40, 60, 100, 100], [70, 50, 100, 50]);
    expect(state.selections.made).toEqual(4);
    expect(state.selections.left).toEqual(0);
    expect(state.isCleared).toEqual(true);
    expect(tileStateLayout).toEqual([
      ["✔", "✔", "✔", "✔", "✔"],
      ["✔", "✔", "✔", "✔", "✔"],
      ["✔", "✔", "■", "✔", "✔"],
      ["✔", "✔", "✔", "✔", "✔"],
      ["✔", "✔", "✔", "✔", "✔"],
    ]);
  });
});
