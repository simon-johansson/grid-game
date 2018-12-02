import { IGameLevel, IGameRules, IGridLayout } from "../domain/boundaries/input";
import { IGameState } from "../domain/boundaries/output";
import GameBoard from "./components/GameBoard";
import LevelSelector from "./components/LevelSelector";
import MovesCounter from "./components/MovesCounter";
import { gameBoardLayouts } from "./data/levels";
import QueryStringHandler from "./utils/QueryStringHandler";

class App {
  private currentLevel: number;
  private isTransitioningBetweenLevels: boolean = false;
  private GameBoardComponent: GameBoard;
  private LevelSelectorComponent: LevelSelector;
  private MovesCounterComponent: MovesCounter;
  private queryString = new QueryStringHandler(window.location.search);

  public init = (): void => {
    this.currentLevel = this.queryString.level || 0;
    this.createComponents();
  };

  private createComponents() {
    this.MovesCounterComponent = new MovesCounter();
    this.LevelSelectorComponent = new LevelSelector(
      this.goToPrevLevel.bind(this),
      this.goToNextLevel.bind(this),
      this.restartLevel.bind(this)
    );
    this.GameBoardComponent = new GameBoard(this.getLevel(), this.onGameStateUpdate.bind(this));
  }

  private getLevel(): IGameLevel {
    return {
      layout: this.getLayout(),
      rules: this.getRules(),
      moves: this.getMoves()
    };
  }

  private getLayout = (): IGridLayout => {
    return this.queryString.layout || gameBoardLayouts[this.currentLevel].layout;
  };

  private getRules = (): IGameRules => {
    const rules = gameBoardLayouts[this.currentLevel].rules || {};
    const { toggleOnOverlap, minSelection } = this.queryString;
    if (toggleOnOverlap !== undefined) {
      Object.assign(rules, { toggleOnOverlap });
    }
    if (minSelection !== undefined) {
      Object.assign(rules, { minSelection });
    }
    return rules;
  };

  private getMoves = (): number => {
    return this.queryString.layout ? undefined : gameBoardLayouts[this.currentLevel].moves;
  }

  private onGameStateUpdate(gameState: IGameState) {
    this.updateComponents(gameState);

    if (this.shouldProcedeToNextLevel(gameState)) {
      setTimeout(() => {
        this.goToNextLevel();
      }, 500);
      return;
    }

    if (this.shouldRestartCurrentLevel(gameState)) {
      setTimeout(() => {
        this.restartLevel();
      }, 500);
      return;
    }
  }

  private shouldProcedeToNextLevel(state: IGameState): boolean {
    return state.cleared && this.currentLevel <= gameBoardLayouts.length - 1 && !this.queryString.layout;
  }

  private shouldRestartCurrentLevel(gameState: IGameState): boolean {
    return gameState.selectionsLeft === 0;
  }

  private restartLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      this.GameBoardComponent.restartLevel(this.getLevel()).then(() => {
        this.isTransitioningBetweenLevels = false;
      });
    }
  }

  private goToPrevLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.currentLevel -= 1;
      this.isTransitioningBetweenLevels = true;
      this.GameBoardComponent.goToPrevLevel(this.getLevel()).then(() => {
        this.isTransitioningBetweenLevels = false;
      });
    }
  }

  private goToNextLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.currentLevel += 1;
      this.isTransitioningBetweenLevels = true;
      this.GameBoardComponent.goToNextLevel(this.getLevel()).then(() => {
        this.isTransitioningBetweenLevels = false;
      });
    }
  }

  private updateComponents(gameState: IGameState): void {
    this.MovesCounterComponent.render({
      selectionsLeft: gameState.selectionsLeft,
      selectionsMade: gameState.selectionsMade.valid,
      isLevelCleared: gameState.cleared
    });

    this.LevelSelectorComponent.render({
      currentLevel: this.currentLevel,
      isLastLevel: this.currentLevel >= gameBoardLayouts.length - 1
    });
  }
}

const app = new App();
app.init();
