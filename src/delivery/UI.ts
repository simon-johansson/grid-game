import Interactor from "@application/Interactor";
import { IGameLevel, ILevelData } from "@application/interfaces";
import GameBoardEdit from "./components/GameBoardEditor";
import GameBoardPlayable from "./components/GameBoardPlayable";
import LevelSelector from "./components/LevelSelector";
import MovesCounter from "./components/MovesCounter";

// TODO: byt ordning på metoderna, ska följa en logisk ordning
export default class UserInterface {
  private isEditing: boolean;
  private isTransitioningBetweenLevels: boolean = false;
  private GameBoardPlaybaleComponent: GameBoardPlayable;
  private GameBoardEditorComponent: GameBoardEdit;
  private LevelSelectorComponent: LevelSelector;
  private MovesCounterComponent: MovesCounter;

  constructor(private interactor: Interactor) {
    this.isEditing = this.interactor.isInEditMode;
    this.createComponents();
  }

  private createComponents(): void {
    this.LevelSelectorComponent = new LevelSelector(
      this.prevLevel.bind(this),
      this.nextLevel.bind(this),
      this.restartLevel.bind(this),
      this.reviewLevel.bind(this),
      this.editLevel.bind(this),
    );

    if (this.isEditing) {
      this.GameBoardEditorComponent = new GameBoardEdit(this.interactor, this.onEditStateUpdate.bind(this));
    } else {
      this.MovesCounterComponent = new MovesCounter();
      this.GameBoardPlaybaleComponent = new GameBoardPlayable(this.interactor, this.onPlayStateUpdate.bind(this));
    }
  }

  private onEditStateUpdate(level: ILevelData): void {
    this.updateComponents(level);
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
    this.interactor.goToPlayMode();
  }

  private editLevel(): void {
    this.interactor.goToEditMode();
  }

  private shouldProcedeToNextLevel({ isCleared, isLastLevel, isCustom }: ILevelData): boolean {
    return isCleared && !isLastLevel && !isCustom;
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
      isReviewing: level.isCustom && !this.isEditing,
    });
  }
}
