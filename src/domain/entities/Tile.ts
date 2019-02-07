import { IGameRules, ITilePresenter, TileType } from "../boundaries/input";
import { ITile } from "../boundaries/output";
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
    public tileType: TileType,
    initState: IInitState,
    public position: GridPoint,
    // TODO: Skicka inte med rules här
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

  public checkIfSelected(selection: IGridSpan, tileType?: TileType): void {
    const intersects = this.doesIntersectWithSelection(selection);
    const shouldChangeTileType =  intersects && tileType;
    const shouldChangeSelectionState =  this.isSelected !== intersects;

    if (shouldChangeTileType) {
      this.changeTileType(tileType);
    } else if (shouldChangeSelectionState) {
      this.changeSelectionState(intersects);
    }
  }

  private doesIntersectWithSelection(selection: IGridSpan): boolean {
    const { rowIndex, colIndex } = this.position;
    const rowIntersect = selection.startTile.rowIndex <= rowIndex && selection.endTile.rowIndex >= rowIndex;
    const colIntersect = selection.startTile.colIndex <= colIndex && selection.endTile.colIndex >= colIndex;
    return rowIntersect && colIntersect;
  }

  private changeTileType(tileType: TileType): void {
    this.state.selected = false;
    this.setTileType(tileType);
    this.presenter.render(this);
  }

  private changeSelectionState(tileIntersects: boolean) {
    this.state.selected = tileIntersects;
    this.presenter.render(this);
  }

  private setTileType(tileType: TileType): void {
    this.tileType = tileType;

    switch (tileType) {
      case TileType.Regular:
        this.state.blocker = false;
        this.state.cleared = false;
        break;

      case TileType.Cleared:
        this.state.blocker = false;
        this.state.cleared = true;
        break;

        case TileType.Blocker:
        this.state.blocker = true;
        this.state.cleared = false;
        break;
    }
  }
}
