import Rules from "./Rules";
import TilePosition from "./TilePosition";
import TileSpan from "./TileSpan";

export interface ITilePresentationData {
  isSelected: boolean;
  isBlocker: boolean;
  isCleared: boolean;
  position: TilePosition;
  clearsRequired: number;
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
  private selected: boolean = false;

  constructor(
    public tileType: TileType,
    public position: TilePosition,
    // TODO: Skicka inte med rules här
    private rules: Rules,
    private presenter: ITilePresenter,
  ) {
    this.render();
  }

  public get isSelected(): boolean {
    return this.selected;
  }
  public get isBlocker(): boolean {
    return this.tileType === TileType.Blocker;
  }
  public get isCleared(): boolean {
    return this.tileType === TileType.Cleared;
  }
  // Legacy, behövs för lite annat
  public get clearsRequired(): number {
    return 0;
  }

  public toggleCleared() {
    if (this.isClearable) {
      const type = !this.isCleared ? TileType.Cleared : TileType.Regular;
      this.setTileType(type);
    }
  }

  public deselect() {
    this.setSelected(false);
  }

  public get isClearable(): boolean {
    if (!this.isBlocker) {
      if (this.rules.toggleOnOverlap) return true;
      else if (!this.isCleared) return true;
    }
    return false;
  }

  public applySelection(selection: TileSpan, tileType?: TileType): void {
    const isSelected = this.isCoveredBySelection(selection);
    if (isSelected && tileType) this.setTileType(tileType);
    else this.setSelected(isSelected);
  }

  private isCoveredBySelection(selection: TileSpan): boolean {
    return selection.isCovering(this.position);
  }

  private setTileType(tileType: TileType): void {
    if (this.tileType !== tileType) {
      this.tileType = tileType;
      this.render();
    }
  }

  private setSelected(selected: boolean) {
    if (this.selected !== selected) {
      this.selected = selected;
      this.render();
    }
  }

  private render() {
    this.presenter.render(this);
  }
}
