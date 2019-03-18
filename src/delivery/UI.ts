import Interactor from "@application/Interactor";
import { IGameLevel, ILevelData } from "@application/interfaces";
import GameBoardEdit from "./components/GameBoardEditor";
import GameBoardPlayable from "./components/GameBoardPlayable";
import LevelSelector from "./components/LevelSelector";
import MovesCounter from "./components/MovesCounter";
import QueryStringHandler from "./utils/QueryStringHandler";

// TODO: byt ordning på metoderna, ska följa en logisk ordning
export default class UserInterface {
  private isEditing: boolean;
  private isReviewing: boolean;
  private isTransitioningBetweenLevels: boolean = false;
  private GameBoardPlaybaleComponent: GameBoardPlayable;
  private GameBoardEditorComponent: GameBoardEdit;
  private LevelSelectorComponent: LevelSelector;
  private MovesCounterComponent: MovesCounter;
  private queryString = new QueryStringHandler();

  constructor(interactor: Interactor) {
    this.isEditing = !!this.queryString.getIsEditMode();
    this.isReviewing = !!this.queryString.getCustomLevel() && !this.isEditing;
    this.createComponents(interactor);
  }

  private createComponents(interactor: Interactor): void {
    this.LevelSelectorComponent = new LevelSelector(
      this.prevLevel.bind(this),
      this.nextLevel.bind(this),
      this.restartLevel.bind(this),
      this.reviewLevel.bind(this),
      this.editLevel.bind(this),
    );

    if (this.isEditing) {
      this.GameBoardEditorComponent = new GameBoardEdit(
        interactor,
        this.queryString.getCustomLevel(),
        this.onEditStateUpdate.bind(this),
        this.onEditMade.bind(this),
      );
    } else {
      this.MovesCounterComponent = new MovesCounter();
      this.GameBoardPlaybaleComponent = new GameBoardPlayable(
        interactor,
        this.queryString.getCustomLevel(),
        this.onPlayStateUpdate.bind(this),
      );
    }
  }

  private onEditStateUpdate(level: ILevelData): void {
    this.updateComponents(level);
  }

  private onEditMade(level: IGameLevel): void {
    this.queryString.setCustomLevel(level);
  }

  private onPlayStateUpdate(level: ILevelData): void {
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

  private async restartLevel(): Promise<void> {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.restartLevel();
      this.isTransitioningBetweenLevels = false;
    }
  }

  private async prevLevel(): Promise<void> {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.goToPrevLevel();
      this.isTransitioningBetweenLevels = false;
    }
  }

  private async nextLevel(): Promise<void> {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      await this.GameBoardPlaybaleComponent.goToNextLevel();
      this.isTransitioningBetweenLevels = false;
    }
  }

  private reviewLevel(): void {
    this.queryString.setIsEditMode(false);
    window.location.reload();
  }

  private editLevel(): void {
    this.queryString.setIsEditMode(true);
    window.location.reload();
  }

  private shouldProcedeToNextLevel({ isCleared, isLastLevel }: ILevelData): boolean {
    return isCleared && !isLastLevel && !this.isReviewing;
  }

  private shouldRestartCurrentLevel(level: ILevelData): boolean {
    return level.selections.left === 0;
  }

  private updateComponents(level: ILevelData): void {
    if (!this.isEditing) {
      this.MovesCounterComponent.render({
        selectionsLeft: level.selections.left,
        selectionsMade: level.selections.made,
        isLevelCleared: level.isCleared,
      });
    }

    this.LevelSelectorComponent.render({
      currentLevel: level.name,
      isFirstLevel: level.isFirstLevel,
      isLastLevel: level.isLastLevel,
      isEditing: this.isEditing,
      isReviewing: !!this.queryString.getCustomLevel() && !this.isEditing,
    });
  }
}
