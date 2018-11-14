import { IGameRules, ITilePresenter } from "../boundaries/input";
import GridPoint, { IGridSpan } from "./GridPoint";
import Tile from "./Tile";

interface ISelectedTile extends Tile {
  isSelected: true;
}

export interface IEvaluateSelection {
  tilesLeftToClear: number;
  selectionIsValid: boolean;
}

export default class Grid {
  private tilesLeftToClear: number;

  constructor(private tiles: Tile[], private rules: IGameRules) {
    this.getTileStatus();
  }

  public setSelection(selection: IGridSpan): void {
    this.tiles.forEach(tile => tile.setSelected(selection));
  }

  public evaluateSelection(): IEvaluateSelection {
    const selectionIsInvalid = this.selectionIsInvalid;

    if (!selectionIsInvalid) {
      this.clearSelectedTiles();
    }

    this.deselectTiles();
    this.getTileStatus();

    return {
      tilesLeftToClear: this.tilesLeftToClear,
      selectionIsValid: !selectionIsInvalid
    };
  }

  public get selectionIsInvalid(): boolean {
    return !this.isEnoughTilesSelected || this.isDisqualifyingTileSelected;
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
