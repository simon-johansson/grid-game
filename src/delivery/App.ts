import { IGameLevel, IGameRules, IGridLayout } from "../domain/boundaries/input";
import { IGameState } from "../domain/boundaries/output";
import { ISelectedOptions } from "./components/EditorOptions";
import GameBoardEdit from "./components/GameBoardEditor";
import GameBoardPlayable from "./components/GameBoardPlayable";
import LevelSelector from "./components/LevelSelector";
import MovesCounter from "./components/MovesCounter";
import { gameBoardLayouts } from "./data/levels";
import LevelManager from "./utils/LevelManager";
import QueryStringHandler from "./utils/QueryStringHandler";

// TODO: byt ordning på metoderna, skö följa en logisk ordning
class App {
  private isEditing: boolean;
  private isTransitioningBetweenLevels: boolean = false;
  private GameBoardPlaybaleComponent: GameBoardPlayable;
  private GameBoardEditorComponent: GameBoardEdit;
  private LevelSelectorComponent: LevelSelector;
  private MovesCounterComponent: MovesCounter;
  private queryString = new QueryStringHandler();
  private levelManager = new LevelManager(gameBoardLayouts, this.queryString);

  public init = (): void => {
    this.isEditing = this.queryString.edit;
    this.createComponents();
  };

  private createComponents() {
    this.LevelSelectorComponent = new LevelSelector(
      this.prevLevel.bind(this),
      this.nextLevel.bind(this),
      this.restartLevel.bind(this),
      this.reviewLevel.bind(this),
      this.editLevel.bind(this),
    );
    if (this.isEditing) {
      this.GameBoardEditorComponent = new GameBoardEdit(
        this.levelManager.getCurrentLevel,
        this.onEditStateUpdate.bind(this)
      );
    } else {
      this.MovesCounterComponent = new MovesCounter();
      this.GameBoardPlaybaleComponent = new GameBoardPlayable(
        this.levelManager.getCurrentLevel,
        this.onPlayStateUpdate.bind(this)
      );
    }
  }

  private onEditStateUpdate(gameState: IGameState) {
    this.updateComponents(gameState);
    this.queryString.layout = gameState.grid.layout;
    this.queryString.minSelection = gameState.rules.minSelection;
    this.queryString.toggleOnOverlap = gameState.rules.toggleOnOverlap;
    this.queryString.moves = gameState.selectionsLeft;
  }

  private onPlayStateUpdate(gameState: IGameState) {
    const timeout = (func: () => void) => setTimeout(func.bind(this), 500);
    this.updateComponents(gameState);

    if (this.shouldProcedeToNextLevel(gameState)) {
      timeout(this.nextLevel);
      return;
    }

    if (this.shouldRestartCurrentLevel(gameState)) {
      timeout(this.restartLevel);
      return;
    }
  }

  private async restartLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.restartLevel(this.levelManager.getCurrentLevel);
      this.isTransitioningBetweenLevels = false;
    }
  }

  private async prevLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.levelManager.decrementCurrentLevel();
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.goToPrevLevel(this.levelManager.getCurrentLevel);
      this.isTransitioningBetweenLevels = false;
    }
  }

  private async nextLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.levelManager.incrementCurrentLevel();
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.goToNextLevel(this.levelManager.getCurrentLevel);
      this.isTransitioningBetweenLevels = false;
    }
  }

  private reviewLevel() {
    this.queryString.edit = false;
    window.location.reload();
  }

  private editLevel() {
    this.queryString.edit = true;
    window.location.reload();
  }

  private shouldProcedeToNextLevel(gameState: IGameState): boolean {
    return gameState.cleared && this.levelManager.canProcedeToNextLevel;
  }

  private shouldRestartCurrentLevel(gameState: IGameState): boolean {
    return gameState.selectionsLeft === 0;
  }

  private updateComponents(gameState: IGameState): void {
    if (!this.isEditing) {
      this.MovesCounterComponent.render({
        selectionsLeft: gameState.selectionsLeft,
        selectionsMade: gameState.selectionsMade.valid,
        isLevelCleared: gameState.cleared
      });
    }

    this.LevelSelectorComponent.render({
      currentLevel: this.levelManager.getCurrentLevelNumber,
      isLastLevel: this.levelManager.isLastLevel,
      isEditing: this.isEditing,
      isReviewing: !!this.queryString.layout && !this.isEditing
    });
  }
}

const app = new App();
app.init();
