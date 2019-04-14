import Level from "@domain/Level";
import Rules, { IGameRules } from "@domain/Rules";
import { ISelectionPresenter } from "@domain/Selection";
import { ITilePresenter } from "@domain/Tile";
import { Board5x5 } from "@shared/interfaces";

export { ITypedGridLayout } from "@domain/Level";
export { IGameRules } from "@domain/Rules";
export { ISelectionPresentationData, ISelectionPresenter } from "@domain/Selection";
export { ITilePresentationData, ITilePresenter, TileType } from "@domain/Tile";

export interface ITilePresenterConstructor {
  new (): ITilePresenter;
}

export interface ISelectionPresenterConstructor {
  new (): ISelectionPresenter;
}

export type ITileRawState = "r" | "f" | "b" | "2" | "3" | "4";

export type IGridLayout = Board5x5<ITileRawState>;

export interface IGameLevel {
  layout: IGridLayout;
  moves: number;
  rules?: IGameRules;
  id?: string;
}

export interface ILevelData {
  selections: {
    left: number;
    made: number;
  };
  isCleared: boolean;
  isCustom: boolean;
  id?: string;
  name?: number;
  rules: Rules;
  isLastLevel?: boolean;
  isFirstLevel?: boolean;
  hasCompleted?: boolean;
  isCurrentlyPlaying?: boolean;
}

export interface IStage {
  isCleared: boolean;
  isPlaying: boolean;
  levels: ILevelData[];
}

export interface IOverviewData {
  total: number;
  cleared: number;
  stages: IStage[];
}

export interface INetworkGateway {
  getLevels: () => Promise<IGameLevel[]>;
  getCurrentLevel: () => Promise<string>;
  setCurrentLevel: (levelID: string) => Promise<Response>;
  getCompletedLevels: () => Promise<string[]>;
  setCompletedLevels: (levels: string[]) => Promise<Response>;
}

export interface IAnalytics {
  startLevel: (level: Level) => void;
  onLevelComplete: (level: Level) => void;
  onLevelFailed: (level: Level) => void;
  onError: (error: any) => void;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IUserInformation {
  hasViewedMinSelectionInfo: boolean;
  hasViewedInstallationInfo: boolean;
  clearedLevels: number;
}

export type ISettableUserInformation = Omit<IUserInformation, "clearedLevels">;

export interface IStorage {
  setCurrentLevel: (levelID: string) => void;
  getCurrentLevel: () => Promise<string | null>;
  setUserInformation: (info: Partial<ISettableUserInformation>, persisted?: boolean) => void;
  getUserInformation: () => Promise<IUserInformation>;
  onLevelComplete: (levelID: string) => Promise<string[]>;
  setCompletedLevels: (levels: string[]) => void;
  getCompletedLevels: () => Promise<string[] | null>;
  onFail: (level: Level) => void;
}

export interface IQueryString {
  getLevel: () => IGameLevel | undefined;
  getLayout: () => IGridLayout | undefined;
  setLayout: (layout: IGridLayout) => void;
  getRules: () => IGameRules | undefined;
  setRules: (rules: IGameRules) => void;
  getMoves: () => number | undefined;
  setMoves: (moves: number) => void;
  getLevelNumber: () => number | undefined;
  setLevelNumber: (level: number) => void;
  getIsEditMode: () => boolean | undefined;
  setIsEditMode: (bool: boolean) => void;
}

export interface IInstaller {
  canBeInstalled: boolean;
  canBeInstalledViaNativeInstallPromp: boolean;
  canShowNativeInstallPrompt: boolean;
  showNativeInstallPrompt: () => void;
}
