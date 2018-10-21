import { IGameRules, ITilePresenter } from "./boundaries";
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

  public evaluateSelection(): IEvaluateSelection {
    const selectedTiles = this.getSelectedTiles();
    const tilesToToggleFlip: Tile[] = [];

    let invalidSelection = selectedTiles.some(tile => {
      if (tile.disqualifiesSelection) {
        return true;
      } else {
        if (tile.isFlippable) {
          tilesToToggleFlip.push(tile);
        }
      }
    });

    invalidSelection = invalidSelection || this.notEnoughTilesSelected(selectedTiles.length);

    if (!invalidSelection) {
      tilesToToggleFlip.forEach(el => el.flip());
    }

    this.deselectTiles();
    this.getTileStatus();

    return {
      tilesLeftToClear: this.tilesLeftToClear,
      selectionIsValid: !invalidSelection
    }
  }

  public setSelection(selection: IGridSpan): void {
    this.tiles.forEach(tile => tile.setSelected(selection));
  }

  private deselectTiles(): void {
    this.tiles.forEach(tile => tile.deselect());
  }

  private getTileStatus(): void {
    this.tilesLeftToClear = 0;

    this.tiles.forEach(tile => {
      if (tile.isFlippable && !tile.isFlipped) {
        this.tilesLeftToClear++;
      }
    });
  }

  private getSelectedTiles(): ISelectedTile[] {
    return this.tiles.filter(t => t.isSelected) as ISelectedTile[];
  }

  private notEnoughTilesSelected(selectedTiles: number): boolean {
    return selectedTiles < this.rules.minSelection;
  }
}
