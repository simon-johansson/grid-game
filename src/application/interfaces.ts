import Level from "@domain/Level";
import { IGameRules } from "@domain/Rules";
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
  moves?: number;
  rules?: IGameRules;
  id?: string;
}

export interface ILevelData {
  selections: {
    left: number;
    made: number;
  };
  isCleared: boolean;
  name?: number;
  isLastLevel?: boolean;
  isFirstLevel?: boolean;
}

export interface INetworkGateway {
  getLevels: () => Promise<IGameLevel[]>
}

export interface IAnalytics {
  startLevel: (level: Level) => void;
  onLevelComplete: (level: Level) => void;
  onLevelFailed: (level: Level) => void;
  onError: (error: any) => void;
}

export interface IStorage {
  setCurrentLevel: (level: Level) => void;
  getCurrentLevel: () => Promise<number>;
  onLevelComplete: (level: Level) => Promise<string[]>;
  getCompletedLevels: () => Promise<string[]>;
  onFail: (level: Level) => void;
}
