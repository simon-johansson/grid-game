/* tslint:disable: max-classes-per-file */
import Interactor, { IPresenters } from "@application/Interactor";
import {
  IAnalytics,
  IGameLevel,
  IGridLayout,
  IInstaller,
  ILevelData,
  INetworkGateway,
  IQueryString,
  ISelectionPresenter,
  ISelectionPresenterConstructor,
  IStorage,
  ITilePresenter,
  ITilePresenterConstructor,
  ITypedGridLayout,
  IUserInformation,
} from "@application/interfaces";
import Level from "@domain/Level";
import Rules, { IGameRules } from "@domain/Rules";
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

export const getNetworkGatewayMock = (
  data: IGameLevel[] = [],
  completedLevels: string[] = [],
  currentLevel: string = "",
  clb?: () => void,
): INetworkGateway => ({
  getLevels: () => {
    if (clb) clb();
    return Promise.resolve(data);
  },
  getCurrentLevel: () => Promise.resolve(currentLevel),
  setCurrentLevel: (levelID: string) => Promise.resolve() as any,
  getCompletedLevels: () => Promise.resolve(completedLevels),
  setCompletedLevels: (levels: string[]) => Promise.resolve() as any,
});

export const getAnalyticsMock = (): IAnalytics => ({
  startLevel: (level: Level) => {},
  onLevelComplete: (level: Level) => {},
  onLevelFailed: (level: Level) => {},
  onError: (error: any) => {},
});

export const getStorageMock = (data: string[] = []): IStorage => {
  let completedLevels = data;
  let currentLevel = "id-0";
  return {
    setCurrentLevel: (id: string) => {
      currentLevel = id;
    },
    getCurrentLevel: () => Promise.resolve(currentLevel),
    setUserInformation: (info: Partial<IUserInformation>) => {},
    getUserInformation: () => {
      return Promise.resolve({
        hasViewedMinSelectionInfo: false,
        hasViewedInstallationInfo: false,
        clearedLevels: 0,
      });
    },
    onLevelComplete: (id: string): Promise<string[]> => {
      return Promise.resolve(completedLevels);
    },
    setCompletedLevels: (levels: string[]) => {
      completedLevels = levels;
    },
    getCompletedLevels: (): Promise<string[]> => {
      return Promise.resolve(completedLevels);
    },
    onFail: (level: Level) => {},
  };
};

export const getQuerystringMock = (level: any = {}, options: { isEditMode?: boolean } = {}): IQueryString => ({
  getLevel: () => undefined,
  getLayout: () => undefined,
  setLayout: (layout: IGridLayout) => (level.layout = layout),
  getRules: () => undefined,
  setRules: (rules: IGameRules) => (level.rules = rules),
  getMoves: () => undefined,
  setMoves: (moves: number) => (level.moves = moves),
  getLevelNumber: () => undefined,
  setLevelNumber: (num: number) => undefined,
  getIsEditMode: () => options.isEditMode,
  setIsEditMode: (bool: boolean) => undefined,
});

export const getInstallerMock = (): IInstaller => ({
  canBeInstalled: false,
  canBeInstalledViaNativeInstallPromp: false,
  canShowNativeInstallPrompt: false,
  showNativeInstallPrompt: () => {},
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

export const getDefaultGameLevels = (amount: number): IGameLevel[] => {
  const levelDefaults = {
    rules: new Rules(),
    moves: 3,
  };

  return Array.from({ length: amount }, (el, index) => ({
    ...levelDefaults,
    layout: defaultLayout,
    id: `id-${index}`,
  })) as IGameLevel[];
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
  ["r", "r", "r", "r", "r"],
  ["f", "f", "f", "f", "f"],
  ["b", "b", "b", "b", "b"],
  ["r", "r", "r", "r", "r"],
  ["f", "f", "f", "f", "f"],
];
