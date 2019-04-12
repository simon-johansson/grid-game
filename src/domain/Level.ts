import { Board5x5 } from "@shared/interfaces";
import Rules from "./Rules";
import { TileType } from "./Tile";
import TileSpan from "./TileSpan";

export interface ILevelOptions {
  name: number;
  hasCompleted: boolean;
  isCurrentlyPlaying: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export type ITypedGridLayout = Board5x5<TileType>;

interface ISelections {
  left: number;
  made: number;
  history: TileSpan[];
}

interface IGrid {
  layout: ITypedGridLayout;
  numberOfRows: number;
  numberOfCols: number;
}

const getGridObject = (layout: ITypedGridLayout): IGrid => ({
  layout,
  numberOfRows: layout.length,
  numberOfCols: layout[0].length,
});

const getSelectionObject = (moves: number): ISelections => ({
  left: moves,
  made: 0,
  history: [],
});

export default class Level {
  public isCleared: boolean = false;
  public readonly isCustom: boolean;
  public readonly rules: Rules;
  public readonly grid: IGrid;
  public readonly selections: ISelections;
  public readonly id?: string;
  public readonly name?: number;
  public readonly hasCompleted?: boolean;
  public readonly isCurrentlyPlaying?: boolean;
  public readonly isFirstLevel?: boolean;
  public readonly isLastLevel?: boolean;

  constructor(layout: ITypedGridLayout, moves: number, rules: Rules, id: string | undefined, options?: ILevelOptions) {
    this.grid = getGridObject(layout);
    this.selections = getSelectionObject(moves);
    this.rules = rules;
    this.id = id;
    this.isCustom = !this.id;
    if (options !== undefined) {
      this.name = options.name;
      this.hasCompleted = options.hasCompleted;
      this.isCurrentlyPlaying = options.isCurrentlyPlaying;
      this.isFirstLevel = options.isFirst;
      this.isLastLevel = options.isLast;
    }
  }

  public onValidSelection(selection: TileSpan): void {
    this.selections.made++;
    this.selections.history.push(selection);

    if (this.selections.left) {
      this.selections.left--;
    }
  }
}
