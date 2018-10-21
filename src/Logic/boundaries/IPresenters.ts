import Selection from '../Selection';
import Tile from '../Tile';

export interface ITilePresenterConstructor {
  new(): ITilePresenter;
}
export interface ITilePresenter {
  render: (tile: Tile) => void;
}

export interface ISelectionPresenterConstructor {
  new(): ISelectionPresenter;
}
export interface ISelectionPresenter {
  render: (selection: Selection) => void;
  clear: () => void;
}
