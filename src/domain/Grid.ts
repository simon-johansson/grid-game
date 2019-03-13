import Rules from "./Rules";
import Tile, { TileType } from "./Tile";
import TileSpan from "./TileSpan";

interface ISelectedTile extends Tile {
  isSelected: true;
}

export default class Grid {
  constructor(public tiles: Tile[], private rules: Rules) {}

  public applySelection(selection: TileSpan, tileState?: TileType): void {
    this.tiles.forEach(tile => tile.applySelection(selection, tileState));
  }

  public get isSelectedTilesClearable(): boolean {
    return this.isEnoughTilesSelected && !this.isDisqualifyingTileSelected;
  }

  public deselectTiles(): void {
    this.selectedTiles.forEach(tile => tile.deselect());
  }

  public toggleClearedOnSelectedTiles(): void {
    this.selectedTiles.forEach(tile => tile.toggleCleared());
  }

  public get isGridCleared(): boolean {
    const tileLeftToClear = (tile: Tile) => tile.isClearable && !tile.isCleared;
    return !this.tiles.some(tileLeftToClear);
  }

  private get selectedTiles(): ISelectedTile[] {
    return this.tiles.filter(t => t.isSelected) as ISelectedTile[];
  }

  private get isEnoughTilesSelected(): boolean {
    return this.selectedTiles.length >= this.rules.minSelection;
  }

  private get isDisqualifyingTileSelected(): boolean {
    return this.selectedTiles.some(tile => tile.isBlocker);
  }
}
