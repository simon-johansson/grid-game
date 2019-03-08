import Rules from "../../../domain/Rules";
import {
  defaultLayout,
  getAnalyticsMock,
  getNetworkGatewayMock,
  getSelectionPresenter,
  getTilePresenter,
  ITileStateLayout,
  setSelectionAndProcessHelper,
} from "../../../shared/__tests__/testUtils";
import Interactor, { IPresenters } from "../../Interactor";
import { IGameLevel } from "../../interfaces";

const tileStateLayout: ITileStateLayout = [[], [], [], [], []];
const presenters: IPresenters = {
  selection: getSelectionPresenter(),
  tile: getTilePresenter(() => {}, tileStateLayout),
};
const levels: IGameLevel[] = [{ layout: defaultLayout, moves: 2, rules: new Rules() }];
const interactor = new Interactor(getNetworkGatewayMock(levels), getAnalyticsMock());
interactor.loadLevels();
const setSelectionAndProcess = setSelectionAndProcessHelper(interactor);

describe("restart level", () => {
  test("start level", () => {
    interactor.startCurrentLevel(presenters);
  });

  test("make a selection level", () => {
    const state = setSelectionAndProcess([0, 0, 50, 50]);
    expect(state.selections.made).toEqual(1);
    expect(state.selections.left).toEqual(1);
    expect(state.isCleared).toEqual(false);
  });

  test("restart level", () => {
    const state = interactor.startCurrentLevel(presenters);
    expect(state.selections.made).toEqual(0);
    expect(state.selections.left).toEqual(2);
    expect(state.isCleared).toEqual(false);
  });
});
