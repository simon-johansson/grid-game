import { IGameLevel, IGameRules, IGameState, IGridLayout } from "./boundaries";
import { IEvaluateSelection } from "./Grid";

export default class GameState implements IGameState {
  public selectionsMade = {
    valid: 0,
    invalid: 0,
  };
  public selectionsLeft: number | undefined;
  public cleared = false;
  public grid: {
    layout: IGridLayout;
    numberOfRows: number;
    numberOfCols: number;
  };
  public rules: IGameRules = {
    toggleOnOverlap: true,
    minSelection: 1
  };

  constructor(gameLevel: IGameLevel) {
    this.selectionsLeft = gameLevel.moves;

    this.grid = {
      layout: gameLevel.layout,
      numberOfRows: gameLevel.layout.length,
      numberOfCols: gameLevel.layout[0].length
    };

    Object.assign(this.rules, gameLevel.rules);
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
