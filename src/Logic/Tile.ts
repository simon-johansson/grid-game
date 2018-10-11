import { IRules } from "./GameBoard";
import GridPoint from "./GridPoint";

// type IInitialState = "r" | "f" | "b";

export interface ITilePresenterConstructor {
  new (): ITilePresenter;
}

export interface ITilePresenter {
  render: (tile: Tile) => void;
}

export interface IInitState {
  blocker?: true;
  flipped?: true;
}

interface IState {
  selected: boolean;
  blocker: boolean;
  flipped: boolean;
}

export default class Tile {
  private state: IState = {
    selected: false,
    blocker: false,
    flipped: false
  };

  constructor(
    initState: IInitState,
    public position: GridPoint,
    private rules: IRules,
    private presenter: ITilePresenter
  ) {
    Object.assign(this.state, initState);
    this.presenter.render(this);
  }

  public get isSelected(): boolean {
    return this.state.selected;
  }
  public get isBlocker(): boolean {
    return this.state.blocker;
  }
  public get isFlipped(): boolean {
    return this.state.flipped;
  }

  public flip() {
    if (this.isFlippable) {
      this.state.flipped = !this.isFlipped;
      this.presenter.render(this);
    }
  }

  public deselect() {
    this.state.selected = false;
    this.presenter.render(this);
  }

  public get isFlippable(): boolean {
    if (!this.disqualifiesSelection) {
      if (this.rules.toggleOnOverlap) {
        return true;
      } else if (!this.isFlipped) {
        return true;
      }
    } else {
      return false;
    }
  }

  public get disqualifiesSelection(): boolean {
    return this.isBlocker;
  }

  public setSelected(selection: [GridPoint, GridPoint]): void {
    const prevState = this.isSelected;
    const { rowIndex, colIndex } = this.position;
    const rowIntersect = selection[0].rowIndex <= rowIndex && selection[1].rowIndex >= rowIndex;
    const colIntersect = selection[0].colIndex <= colIndex && selection[1].colIndex >= colIndex;
    this.state.selected = rowIntersect && colIntersect;

    if (prevState !== this.isSelected) {
      this.presenter.render(this);
    }
  }
}
