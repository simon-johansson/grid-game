import { ISelection } from "./ISelection";
import { ITile } from "./ITile";

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
