import { ISelection, ITile } from "./output";

export interface ITilePresenterConstructor {
  new (): ITilePresenter;
}
export interface ITilePresenter {
  render: (tile: ITile) => void;
}

export interface ISelectionPresenterConstructor {
  new (): ISelectionPresenter;
}
export interface ISelectionPresenter {
  render: (selection: ISelection) => void;
  clear: () => void;
}

export interface IGameRules {
  toggleOnOverlap?: boolean;
  minSelection?: number;
}

export type ITileRawState = "r" | "f" | "b" | "2" | "3" | "4";

export type IGridLayout = ITileRawState[][];

export interface IGameLevel {
  layout: IGridLayout;
  moves?: number;
  rules?: IGameRules;
}
