/* tslint:disable: max-classes-per-file */

import Selection from "../../domain/Selection";
import Tile from "../../domain/Tile";
import GameInteractor, { IPresenters } from "../GameInteractor";
import {
  IGridLayout,
  ILevelData,
  INetworkGateway,
  ISelectionPresenter,
  ISelectionPresenterConstructor,
  ITilePresenter,
  ITilePresenterConstructor,
} from "../interfaces";

// X = selected
// O = not selected
export type ITileSelection = "X" | "O";
export type ITileSelectionLayout = ITileSelection[][];

// ✔ = cleared
// □ = clearable but not cleared
// ■ = blocker
// 2/3/4 = requires X number of clears
export type ITileState = "■" | "✔" | "□" | "2" | "3" | "4";
export type ITileStateLayout = ITileState[][];

export const getTilePresenter = (clb?: (tile: Tile) => void): ITilePresenterConstructor => {
  return class TilePresenter implements ITilePresenter {
    public render(tile: Tile): void {
      if (clb) {
        clb(tile);
      }
    }
  };
};

export const getSelectionPresenter = (
  renderClb?: (selection: Selection) => void,
  clearClb?: () => void,
): ISelectionPresenterConstructor => {
  return class SelectionPresenter implements ISelectionPresenter {
    public render(selection: Selection): void {
      if (renderClb) {
        renderClb(selection);
      }
    }
    public clear(): void {
      if (clearClb) {
        clearClb();
      }
    }
  };
};

export const setSelectionHelper = (gameInteractor: GameInteractor) => {
  return (startX: number, startY: number, endX?: number, endY?: number) => {
    gameInteractor.setSelectionStart(startX, startY);
    if (typeof endX !== "undefined" && typeof endY !== "undefined") {
      gameInteractor.setSelectionEnd(endX, endY);
    }
  };
};

export const setSelectionAndEvaluateHelper = (gameInteractor: GameInteractor) => {
  return (...args: Array<[number, number, number, number]>): ILevelData => {
    const setSelection = setSelectionHelper(gameInteractor);
    let state: any;
    args.forEach(arg => {
      setSelection(...arg);
      state = gameInteractor.processSelection();
    });
    return state;
  };
};

export const evaluatedLayout = (state: ITileState | ITileSelection) => {
  const layout: any = [[], [], [], [], []];
  layout.forEach((row: any) => row.push(state, state, state, state, state));
  return layout;
};

export const networkGatewayMock: INetworkGateway = {
  getLevels: () => Promise.resolve([]),
};

export const presenters: IPresenters = {
  selection: getSelectionPresenter(),
  tile: getTilePresenter(),
};

export const defaultLayout: IGridLayout = [
  ["r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r"],
];

export const clearedLayout: IGridLayout = [
  ["f", "f", "f", "f", "f"],
  ["f", "f", "f", "f", "f"],
  ["f", "f", "f", "f", "f"],
  ["f", "f", "f", "f", "f"],
  ["f", "f", "f", "f", "f"],
];

export const blockerLayout: IGridLayout = [
  ["b", "b", "b", "b", "b"],
  ["b", "b", "b", "b", "b"],
  ["b", "b", "b", "b", "b"],
  ["b", "b", "b", "b", "b"],
  ["b", "b", "b", "b", "b"],
];

export const mixedLayout: IGridLayout = [
  ["f", "2", "3", "4", "b"],
  ["r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r"],
];

export const twoMultiTilesLayout: IGridLayout = [
  ["2", "2", "2", "2", "2"],
  ["2", "2", "2", "2", "2"],
  ["2", "2", "2", "2", "2"],
  ["2", "2", "2", "2", "2"],
  ["2", "2", "2", "2", "2"],
];

export const threeMultiTilesLayout: IGridLayout = [
  ["3", "3", "3", "3", "3"],
  ["3", "3", "3", "3", "3"],
  ["3", "3", "3", "3", "3"],
  ["3", "3", "3", "3", "3"],
  ["3", "3", "3", "3", "3"],
];

export const fourMultiTilesLayout: IGridLayout = [
  ["4", "4", "4", "4", "4"],
  ["4", "4", "4", "4", "4"],
  ["4", "4", "4", "4", "4"],
  ["4", "4", "4", "4", "4"],
  ["4", "4", "4", "4", "4"],
];
