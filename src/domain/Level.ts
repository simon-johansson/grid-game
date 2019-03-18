import { Board5x5 } from "@shared/interfaces";
import Rules from "./Rules";
import { TileType } from "./Tile";

interface ISelections {
  left: number;
  made: number;
}

export type ITypedGridLayout = Board5x5<TileType>;

interface IGrid {
  layout: ITypedGridLayout;
  numberOfRows: number;
  numberOfCols: number;
}

export default class Level {
  public isCleared: boolean = false;
  public grid: IGrid;
  public selections: ISelections;

  constructor(
    layout: ITypedGridLayout,
    moves: number,
    public rules: Rules,
    public name?: number,
    public isFirstLevel?: boolean,
    public isLastLevel?: boolean,
    public id?: string,
    public hasCompleted?: boolean
  ) {
    this.grid = {
      layout,
      numberOfRows: layout.length,
      numberOfCols: layout[0].length,
    };

    this.selections = {
      left: moves,
      made: 0,
    };
  }

  public onValidSelection(): void {
      this.selections.made++;

      if (this.selections.left) {
        this.selections.left--;
      }
  }
}
