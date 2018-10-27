import { IGameRules, ITile, ITilePresenter } from "./boundaries";
import GridPoint, { IGridSpan } from "./GridPoint";

export interface IInitState {
  selected?: boolean;
  blocker?: boolean;
  cleared?: boolean;
  clearsRequired?: number;
}

export default class Tile implements ITile {
  private state: IInitState = {
    selected: false,
    blocker: false,
    cleared: false,
    clearsRequired: 1
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
  public get isCleared(): boolean {
    return this.state.cleared;
  }
  public get clearsRequired(): number {
    return this.state.clearsRequired;
  }

  public clear() {
    if (this.isClearable) {
      if (this.state.clearsRequired > 1) {
        this.state.clearsRequired--;
      } else {
        this.state.cleared = !this.state.cleared;
      }
      this.presenter.render(this);
    }
  }

  public deselect() {
    this.state.selected = false;
    this.presenter.render(this);
  }

  public get isClearable(): boolean {
    if (!this.disqualifiesSelection) {
      if (this.rules.toggleOnOverlap) {
        return true;
      } else if (!this.isCleared) {
        return true;
      }
    }
    return false;
  }

  public get disqualifiesSelection(): boolean {
    // Might be onther cases in future
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
