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
  public readonly isCustom: boolean;
  public readonly grid: IGrid;
  public readonly selections: ISelections;

  constructor(
    layout: ITypedGridLayout,
    moves: number,
    public readonly rules: Rules,
    public readonly name?: number,
    public readonly isFirstLevel?: boolean,
    public readonly isLastLevel?: boolean,
    public readonly id?: string,
    public readonly hasCompleted?: boolean
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

    this.isCustom = this.name === undefined;
  }

  public onValidSelection(): void {
      this.selections.made++;

      if (this.selections.left) {
        this.selections.left--;
      }
  }
}
