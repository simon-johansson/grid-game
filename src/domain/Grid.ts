import Rules from "./Rules";
import Tile, {TileType} from "./Tile";
import TileGroup from "./TileGroup";
import TileSpan from "./TileSpan";

const getSelectables = (tiles: Tile[], groups: TileGroup[]) => {
  const selectables: Array<Tile | TileGroup> = [];
  tiles.forEach(tile => {
    const tileIsPartOfGroup = groups.some(tileGroup => {
      if (tileGroup.position.isCovering(tile.position)) {
        tileGroup.addTile(tile);
        return true;
      } else {
        return false;
      }
    });
    if (!tileIsPartOfGroup) selectables.push(tile);
  });
  selectables.push(...groups)
  return selectables;
}

export default class Grid {
  private selectables: Array<Tile | TileGroup> = [];

  constructor(public tiles: Tile[], public tileGroups: TileGroup[], private rules: Rules) {
    this.addSelectables();
  }

  public applySelection(selection: TileSpan, tileState?: TileType): void {
    this.selectables.forEach(selectable => selectable.applySelection(selection, tileState));
  }

  public deselectElements(): void {
    this.selectables.forEach(element => element.deselect());
  }

  public toggleClearedOnSelectedTiles(): void {
    this.selectedTiles.forEach(tile => tile.toggleCleared());
  }

  public get isGridCleared(): boolean {
    const tileLeftToClear = (tile: Tile) => tile.isClearable && !tile.isCleared;
    return !this.tiles.some(tileLeftToClear);
  }

  public get isSelectedTilesClearable(): boolean {
    return this.isEnoughTilesSelected && !this.isDisqualifyingTileSelected;
  }

  private addSelectables(): void {
    this.tiles.forEach(tile => {
      const tileIsPartOfGroup = this.tileGroups.some(tileGroup => {
        if (tileGroup.position.isCovering(tile.position)) {
          tileGroup.addTile(tile);
          return true;
        } else {
          return false;
        }
      });
      if (!tileIsPartOfGroup) this.selectables.push(tile);
    });
    this.selectables.push(...this.tileGroups)
  }

  private get selectedTiles(): Tile[] {
    return this.tiles.filter(t => t.isSelected);
  }

  private get isEnoughTilesSelected(): boolean {
    return this.selectedTiles.length >= this.rules.minSelection;
  }

  private get isDisqualifyingTileSelected(): boolean {
    return this.selectedTiles.some(tile => tile.isBlocker);
  }
}
