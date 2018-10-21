import { IGameLevel, IGameRules, IGridLayout } from "./boundaries";
import { IEvaluateSelection } from "./Grid";

// interface IGameState {
//   selections: {
//     valid: number;
//     invalid: number;
//     left: number;
//   };
//   grid: {
//     layout: IGridLayout;
//     numberOfRows: number;
//     numberOfCols: number;
//   };
//   rules: IGameRules;
// }

export default class GameState {
  public selectionsMade: {
    valid: number;
    invalid: number;
  };
  public selectionsLeft: number | undefined;
  public cleared: boolean;
  public grid: {
    layout: IGridLayout;
    numberOfRows: number;
    numberOfCols: number;
  };
  public rules: IGameRules;

  constructor(gameLevel: IGameLevel, rules: IGameRules) {
    this.selectionsMade = {
      valid: 0,
      invalid: 0
    };
    this.selectionsLeft = gameLevel.numberOfSelections || undefined;
    this.cleared = false;
    this.grid = {
      layout: gameLevel.layout,
      numberOfRows: gameLevel.layout.length,
      numberOfCols: gameLevel.layout[0].length
    };
    this.rules = rules;
  }

  public onSelectionMade(evaluatedSelection: IEvaluateSelection) {
    if (evaluatedSelection.selectionIsValid) {
      this.selectionsMade.valid++;
        if (this.selectionsLeft) {
          this.selectionsLeft--;
        }
    } else {
      this.selectionsMade.invalid++;
    }

    if (evaluatedSelection.tilesLeftToClear === 0) {
      this.cleared = true;
    }
  }
}
