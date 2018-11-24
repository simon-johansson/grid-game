import { IGameLevel, IGameRules, IGridLayout } from "../domain/boundaries/input";
import { IGameState } from "../domain/boundaries/output";
import GameBoard from "./components/GameBoard";
import LevelSelector from "./components/LevelSelector";
import MovesCounter from "./components/MovesCounter";
import { gameBoardLayouts } from "./data/levels";
import { getQueryStringParams } from "./utils";

class App {
  private queryStringRules: IGameRules = {};
  private queryStringLayout: IGridLayout;
  private currentLevel: number = 0;
  private isTransitioningBetweenLevels: boolean = false;
  private GameBoardComponent: GameBoard;
  private LevelSelectorComponent: LevelSelector;
  private MovesCounterComponent: MovesCounter;

  public init = (): void => {
    this.analyseQueryString();
    this.createComponents();
  };

  private analyseQueryString = (): void => {
    const queryStringParams = getQueryStringParams(window.location.search);
    const getParam = <T>(param: string): T => {
      try {
        return JSON.parse(queryStringParams[param]) as T;
      } catch (error) {}
    };

    this.queryStringLayout = getParam<IGridLayout>("layout");
    this.currentLevel = getParam<number>("level") || this.currentLevel;
    this.queryStringRules.toggleOnOverlap = getParam<boolean>("toggleOnOverlap");
    this.queryStringRules.minSelection = getParam<number>("minSelection");
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
    const level = this.getLayout();
    level.rules = this.getRules(level.rules);
    return level;
  }

  private getLayout = (): IGameLevel => {
    const layout = this.queryStringLayout;
    return layout ? { layout } : gameBoardLayouts[this.currentLevel];
  };

  private getRules = (rules: IGameRules = {}): IGameRules => {
    return Object.assign(rules, this.queryStringRules);
  };

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
    return state.cleared && this.currentLevel <= gameBoardLayouts.length - 1 && !this.queryStringLayout;
  }

  private shouldRestartCurrentLevel(gameState: IGameState): boolean {
    return gameState.selectionsLeft === 0;
  }

  private restartLevel() {
    if (!this.isTransitioningBetweenLevels) {
      // TODO: this.GameBoardComponent.restartLevel
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
