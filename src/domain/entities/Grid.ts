import { IGameRules, ITilePresenter, TileType } from "../boundaries/input";
import GridPoint, { IGridSpan } from "./GridPoint";
import Tile from "./Tile";

interface ISelectedTile extends Tile {
  isSelected: true;
}

export interface IEvaluateSelection {
  tilesLeftToClear: number;
  isSelectionValid: boolean;
  tiles: Tile[];
}

export default class Grid {
  private tilesLeftToClear: number;

  constructor(private tiles: Tile[], private rules: IGameRules) {
    this.getTileStatus();
  }

  public applySelection(selection: IGridSpan, tileState?: TileType): void {
    this.tiles.forEach(tile => tile.checkIfSelected(selection, tileState));
  }

  // TODO: Går att göra snyggare, lättare att läsa?
  public evaluateSelection(isEditingGrid: boolean): IEvaluateSelection {
    const isSelectionValid = this.isSelectionValid;

    if (!isEditingGrid && isSelectionValid) {
      this.clearSelectedTiles();
    }

    this.cancelSelection();

    return {
      tilesLeftToClear: this.tilesLeftToClear,
      isSelectionValid,
      tiles: this.tiles
    };
  }

  public cancelSelection(): void {
    this.deselectTiles();
    this.getTileStatus();
  }

  public get isSelectionValid(): boolean {
    // console.log(this.isEnoughTilesSelected, !this.isDisqualifyingTileSelected);
    return this.isEnoughTilesSelected && !this.isDisqualifyingTileSelected;
  }

  private deselectTiles(): void {
    this.selectedTiles.forEach(tile => tile.deselect());
  }

  private clearSelectedTiles(): void {
    this.selectedTiles.forEach(tile => tile.clear());
  }

  private getTileStatus(): void {
    this.tilesLeftToClear = 0;

    this.tiles.forEach(tile => {
      if (tile.isClearable && !tile.isCleared) {
        this.tilesLeftToClear++;
      }
    });
  }

  private get selectedTiles(): ISelectedTile[] {
    return this.tiles.filter(t => t.isSelected) as ISelectedTile[];
  }

  private get isEnoughTilesSelected(): boolean {
    return this.selectedTiles.length >= this.rules.minSelection;
  }

  private get isDisqualifyingTileSelected(): boolean {
    return this.selectedTiles.some(tile => tile.disqualifiesSelection);
  }
}
