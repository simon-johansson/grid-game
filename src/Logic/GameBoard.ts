import GridPoint from "./GridPoint";
import Tile, { ITilePresenter } from "./Tile";
import TileFactory from "./TileFactory";
export type IGameBoardLayout = Array<Array<"r" | "f" | "b">>;

export interface IRules {
  toggleOnOverlap: boolean;
}

// export interface ITileFactory {
//   create: () => Tile;
// }

interface ISelectedTile extends Tile {
  isSelected: true;
}

export default class GameBoard {
  constructor(private tiles: Tile[], private rules: IRules) {}

  public evaluateSelection(): void {
    const tilesToToggleFlip: Tile[] = [];

    const invalidSelection = this.getSelectedTiles().some(tile => {
      if (tile.disqualifiesSelection) {
        return true;
      } else {
        if (tile.isFlippable) {
          tilesToToggleFlip.push(tile);
        }
      }
    });

    if (!invalidSelection) {
      tilesToToggleFlip.forEach(el => el.flip());
    }

    this.deselectAllTiles();
  }

  public setSelection(selection: [GridPoint, GridPoint]): void {
    this.tiles.map(t => t.setSelected(selection));
  }

  private deselectAllTiles(): void {
    this.tiles.forEach(t => t.deselect());
  }

  private getSelectedTiles(): ISelectedTile[] {
    return this.tiles.filter(t => t.isSelected) as ISelectedTile[];
  }
}
