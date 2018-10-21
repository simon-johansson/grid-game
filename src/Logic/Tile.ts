import { IGameRules, ITilePresenter, ITilePresenterConstructor } from "./boundaries";
import GridPoint, { IGridSpan } from "./GridPoint";

export interface IInitState {
  blocker?: true;
  flipped?: true;
  flippesNeeded?: number;
}

interface IState {
  selected: boolean;
  blocker: boolean;
  flipped: boolean;
  flippesNeeded: number;
}

export default class Tile {
  private state: IState = {
    selected: false,
    blocker: false,
    flipped: false,
    flippesNeeded: 1
  };

  constructor(
    initState: IInitState,
    public position: GridPoint,
    private rules: IGameRules,
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
  public get flippesLeft(): number {
    return this.state.flippesNeeded;
  }

  public flip() {
    if (this.isFlippable) {
      if (this.state.flippesNeeded > 1) {
        this.state.flippesNeeded--;
      } else {
        this.state.flipped = !this.isFlipped;
        this.presenter.render(this);
      }
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

  public setSelected(selection: IGridSpan): void {
    const prevState = this.isSelected;
    const { rowIndex, colIndex } = this.position;
    const rowIntersect = selection.startTile.rowIndex <= rowIndex && selection.endTile.rowIndex >= rowIndex;
    const colIntersect = selection.startTile.colIndex <= colIndex && selection.endTile.colIndex >= colIndex;
    this.state.selected = rowIntersect && colIntersect;

    if (prevState !== this.isSelected) {
      this.presenter.render(this);
    }
  }
}
