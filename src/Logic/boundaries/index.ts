
export interface IGameRules {
  toggleOnOverlap?: boolean;
  minSelection?: number;
}

export type ITileRawState = "r" | "f" | "b" | "2" | "3" | "4";

export type IGridLayout = ITileRawState[][];

export interface IGameLevel {
  layout: IGridLayout,
  numberOfSelections?: number;
  rules?: IGameRules;
}

export {
  ISelectionPresenter,
  ISelectionPresenterConstructor,
  ITilePresenter,
  ITilePresenterConstructor
} from "./IPresenters";
