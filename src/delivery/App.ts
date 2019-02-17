import { IGameLevel, IGameRules, IGridLayout } from "../application/boundaries/input";
import { ILevel } from "../application/boundaries/output";
import GameBoardEdit from "./components/GameBoardEditor";
import GameBoardPlayable from "./components/GameBoardPlayable";
import LevelSelector from "./components/LevelSelector";
import MovesCounter from "./components/MovesCounter";
import QueryStringHandler from "./utils/QueryStringHandler";

// TODO: byt ordning på metoderna, ska följa en logisk ordning
class App {
  private isEditing: boolean;
  private isReviewing: boolean;
  private isTransitioningBetweenLevels: boolean = false;
  private GameBoardPlaybaleComponent: GameBoardPlayable;
  private GameBoardEditorComponent: GameBoardEdit;
  private LevelSelectorComponent: LevelSelector;
  private MovesCounterComponent: MovesCounter;
  private queryString = new QueryStringHandler();

  constructor() {
    this.isEditing = this.queryString.edit;
    this.isReviewing = !!this.queryString.layout && !this.isEditing;
    this.createComponents();
  }

  private createComponents() {
    this.LevelSelectorComponent = new LevelSelector(
      this.prevLevel.bind(this),
      this.nextLevel.bind(this),
      this.restartLevel.bind(this),
      this.reviewLevel.bind(this),
      this.editLevel.bind(this),
    );

    if (this.isEditing) {
      this.GameBoardEditorComponent = new GameBoardEdit(this.getQueryStringLevel(), this.onEditStateUpdate.bind(this));
    } else {
      this.MovesCounterComponent = new MovesCounter();
      this.GameBoardPlaybaleComponent = new GameBoardPlayable(
        this.getQueryStringLevel(),
        this.onPlayStateUpdate.bind(this),
      );
    }
  }

  // TODO: Flytta denna logik till QueryStringHandler
  private getQueryStringLevel(): IGameLevel {
    return {
      layout: this.queryString.layout,
      moves: this.queryString.moves,
      rules: this.queryString.rules,
    };
  }

  private onEditStateUpdate(level: ILevel) {
    this.updateComponents(level);

    // TODO: skicka in en hel IGameLevel här istället
    this.queryString.layout = level.minified.layout;
    this.queryString.minSelection = level.minified.rules.minSelection;
    this.queryString.toggleOnOverlap = level.minified.rules.toggleOnOverlap;
    this.queryString.moves = level.minified.moves;
  }

  private onPlayStateUpdate(level: ILevel) {
    const timeout = (func: () => void) => setTimeout(func.bind(this), 500);
    this.updateComponents(level);

    if (this.shouldProcedeToNextLevel(level)) {
      timeout(this.nextLevel);
      return;
    }

    if (this.shouldRestartCurrentLevel(level)) {
      timeout(this.restartLevel);
      return;
    }
  }

  private async restartLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.restartLevel();
      this.isTransitioningBetweenLevels = false;
    }
  }

  private async prevLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.goToPrevLevel();
      this.isTransitioningBetweenLevels = false;
    }
  }

  private async nextLevel() {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.goToNextLevel();
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

  private shouldProcedeToNextLevel({ isLastLevel, cleared }: ILevel): boolean {
    return cleared && !isLastLevel && !this.isReviewing;
  }

  private shouldRestartCurrentLevel(level: ILevel): boolean {
    return level.selections.left === 0;
  }

  private updateComponents(level: ILevel): void {
    if (!this.isEditing) {
      this.MovesCounterComponent.render({
        selectionsLeft: level.selections.left,
        selectionsMade: level.selections.made.valid,
        isLevelCleared: level.cleared,
      });
    }

    this.LevelSelectorComponent.render({
      currentLevel: level.index,
      isLastLevel: level.isLastLevel,
      isEditing: this.isEditing,
      isReviewing: !!this.queryString.layout && !this.isEditing,
    });
  }
}

const app = new App();
