import { IGameLevel, IGameRules, ITypedGridLayout } from "../boundaries/input";
import { ILevel } from "../boundaries/output";
import { getMinifiedLayout, getTypedLayout } from "../utils";
import { IEvaluateSelection } from "./Grid";

function assertNever(state: never): never {
  throw new Error("Unkown tile state supplied: " + state);
}

interface ISelections {
  availableFromStart: number;
  left: number;
  made: {
    valid: number;
    invalid: number;
  };
}

interface IGrid {
  layout: ITypedGridLayout;
  numberOfRows: number;
  numberOfCols: number;
}

export default class Level implements ILevel {
  public cleared: boolean = false;
  public id: string;
  public grid: IGrid;
  public rules: IGameRules;
  public selections: ISelections;
  public minified: IGameLevel;

  // TODO: Gör denna dynamisk
  public isLastLevel: boolean = false;

  private defaultRules: IGameRules = {
    toggleOnOverlap: true,
    minSelection: 1
  };

  constructor({ layout, moves, rules }: IGameLevel, public index: number) {
    this.grid = {
      layout: getTypedLayout(layout),
      numberOfRows: layout.length,
      numberOfCols: layout[0].length
    };

    this.rules = this.getRules(rules);

    this.selections = {
      availableFromStart: moves,
      left: moves,
      made: {
        valid: 0,
        invalid: 0
      }
    };

    this.minified = {
      rules: this.rules,
      moves,
      layout
    };
  }

  public onSelectionMade(selection: IEvaluateSelection) {
    if (selection.isSelectionValid) {
      this.selections.made.valid++;
      if (this.selections.left) {
        this.selections.left--;
      }
    } else {
      this.selections.made.invalid++;
    }

    if (selection.tilesLeftToClear === 0) {
      this.cleared = true;
    }

    // TODO: Skapa och kör detta på onEditMade istället
    this.minified.layout = getMinifiedLayout(selection.tiles);
  }

  private getRules(rules: IGameRules): IGameRules {
    return Object.assign(this.defaultRules, rules);
  }
}
