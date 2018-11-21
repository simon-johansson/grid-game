import { IGameLevel, IGameRules, IGridLayout } from "../boundaries/input";
import { IGameState } from "../boundaries/output";
import { IEvaluateSelection } from "./Grid";

export default class GameState implements IGameState {
  public selectionsMade = {
    valid: 0,
    invalid: 0
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

    // TODO: Skriv test för att man kan mata in konstiga query strings
    // TODO: Gör snyggare
    if (gameLevel.rules && gameLevel.rules.minSelection !== undefined) {
      this.rules.minSelection = gameLevel.rules.minSelection
    }
    if (gameLevel.rules && gameLevel.rules.toggleOnOverlap !== undefined) {
      this.rules.toggleOnOverlap = gameLevel.rules.toggleOnOverlap
    }
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
