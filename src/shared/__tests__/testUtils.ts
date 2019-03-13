/* tslint:disable: max-classes-per-file */
import Interactor, { IPresenters } from "@application/Interactor";
import {
  IAnalytics,
  IGameLevel,
  IGridLayout,
  ILevelData,
  INetworkGateway,
  ISelectionPresenter,
  ISelectionPresenterConstructor,
  IStorage,
  ITilePresenter,
  ITilePresenterConstructor,
  ITypedGridLayout,
} from "@application/interfaces";
import Level from "@domain/Level";
import Rules from "@domain/Rules";
import { ISelectionPresentationData } from "@domain/Selection";
import Tile, { TileType } from "@domain/Tile";
import TilePosition from "@domain/TilePosition";

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

export const getTilePresenter = (
  clb?: (tile: Tile) => void,
  tileStateLayout?: ITileStateLayout,
  tileSelectionLayout?: ITileSelectionLayout,
): ITilePresenterConstructor => {
  return class TilePresenter implements ITilePresenter {
    public render(tile: Tile): void {
      if (tileStateLayout) {
        const { rowIndex, colIndex } = tile.position;
        if (tile.isBlocker) {
          tileStateLayout[rowIndex][colIndex] = "■";
        } else if (tile.isCleared) {
          tileStateLayout[rowIndex][colIndex] = "✔";
        } else {
          tileStateLayout[rowIndex][colIndex] = "□";
        }
      }

      if (tileSelectionLayout) {
        const { rowIndex, colIndex } = tile.position;
        tileSelectionLayout[rowIndex][colIndex] = tile.isSelected ? "X" : "O";
      }

      if (clb) {
        clb(tile);
      }
    }
  };
};

export const getSelectionPresenter = (
  renderClb?: (data: ISelectionPresentationData) => void,
): ISelectionPresenterConstructor => {
  return class SelectionPresenter implements ISelectionPresenter {
    public render(data: ISelectionPresentationData): void {
      if (renderClb) {
        renderClb(data);
      }
    }
  };
};

export const setSelectionHelper = (interactor: Interactor) => {
  return (startX: number, startY: number, endX?: number, endY?: number) => {
    interactor.setSelectionStart(startX, startY);
    if (typeof endX !== "undefined" && typeof endY !== "undefined") {
      interactor.setSelectionEnd(endX, endY);
    }
  };
};

export const setSelectionAndProcessHelper = (interactor: Interactor) => {
  return (...args: Array<[number, number, number, number]>): ILevelData => {
    const setSelection = setSelectionHelper(interactor);
    let state: any;
    args.forEach(arg => {
      setSelection(...arg);
      state = interactor.processSelection();
    });
    return state;
  };
};

export const processedLayout = (state: ITileState | ITileSelection) => {
  const layout: any = [[], [], [], [], []];
  layout.forEach((row: any) => row.push(state, state, state, state, state));
  return layout;
};

export const getNetworkGatewayMock = (data: IGameLevel[] = []): INetworkGateway => ({
  getLevels: () => Promise.resolve(data),
});

export const getAnalyticsMock = (): IAnalytics => ({
  startLevel: (level: Level) => {},
  onLevelComplete: (level: Level) => {},
  onLevelFailed: (level: Level) => {},
  onError: (error: any) => {},
});

export const getStorageMock = (data: string[] = []): IStorage => ({
  setCurrentLevel: (level: Level) => {},
  getCurrentLevel: () => Promise.resolve(0),
  onLevelComplete: (level: Level): Promise<string[]> => {
    return Promise.resolve(data);
  },
  getCompletedLevels: (): Promise<string[]> => {
    return Promise.resolve(data);
  },
  onFail: (level: Level) => {},
});

export const presenters: IPresenters = {
  selection: getSelectionPresenter(),
  tile: getTilePresenter(),
};

export const createTiles = (layout: ITypedGridLayout): Tile[] => {
  const tiles: Tile[] = [];
  layout.forEach((row, rowIndex) => {
    row.forEach((tileState, colIndex) => {
      tiles.push(new Tile(tileState, new TilePosition(rowIndex, colIndex), new Rules(), new presenters.tile()));
    });
  });
  return tiles;
};

export const get5x5TypedLayout = (type: TileType) =>
  Array.from({ length: 5 }, () => {
    return Array.from({ length: 5 }, () => type);
  }) as ITypedGridLayout;

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
  ["r", "r", "r", "r", "r"],
  ["f", "f", "f", "f", "f"],
  ["b", "b", "b", "b", "b"],
  ["r", "r", "r", "r", "r"],
  ["f", "f", "f", "f", "f"],
];
