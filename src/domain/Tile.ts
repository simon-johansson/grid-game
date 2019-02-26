import { IGameRules } from "../application/interfaces";
import GridPoint, { IGridSpan } from "./GridPoint";

export interface ITilePresentationData {
  isSelected: boolean;
  isBlocker: boolean;
  isCleared: boolean;
  clearsRequired: number;
  position: GridPoint;
}

export interface ITilePresenter {
  render: (tile: ITilePresentationData) => void;
}

export enum TileType {
  Blocker = "Blocker",
  Regular = "Regular",
  Cleared = "Cleared",
}

export default class Tile {
  // TODO: Kan jag använda TileType istället för state?
  private state = {
    selected: false,
    blocker: false,
    cleared: false,
    clearsRequired: 1,
  };

  constructor(
    public tileType: TileType,
    public position: GridPoint,
    // TODO: Skicka inte med rules här
    private rules: IGameRules,
    private presenter: ITilePresenter,
  ) {
    this.setTileType(this.tileType);
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

  public applySelection(selection: IGridSpan, tileType?: TileType): void {
    const isCovered = this.isCoveredBySelection(selection);
    if (isCovered && tileType) this.setTileType(tileType);
    else if (this.isSelected !== isCovered) this.changeSelectionState(isCovered);
  }

  public isCoveredBySelection(selection: IGridSpan): boolean {
    const { rowIndex, colIndex } = this.position;
    const rowIntersect = selection.startTile.rowIndex <= rowIndex && selection.endTile.rowIndex >= rowIndex;
    const colIntersect = selection.startTile.colIndex <= colIndex && selection.endTile.colIndex >= colIndex;
    return rowIntersect && colIntersect;
  }

  private changeSelectionState(isSelected: boolean) {
    this.state.selected = isSelected;
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

    this.presenter.render(this);
  }
}
