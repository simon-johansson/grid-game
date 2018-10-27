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

export interface IGameState {
  selectionsMade: {
    valid: number;
    invalid: number;
  };
  selectionsLeft: number | undefined;
  cleared: boolean;
  grid: {
    layout: IGridLayout;
    numberOfRows: number;
    numberOfCols: number;
  };
  rules: IGameRules;
}

export { ITile } from "./ITile";
export { ISelection } from "./ISelection";
export {
  ISelectionPresenter,
  ISelectionPresenterConstructor,
  ITilePresenter,
  ITilePresenterConstructor
} from "./IPresenters";
