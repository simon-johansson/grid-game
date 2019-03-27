/* tslint:disable: no-unused-expression */
import Interactor from "@application/Interactor";
import { ILevelData } from "@application/interfaces";
import LevelSelector from "../components/LevelSelector";
import MovesCounter from "../components/MovesCounter";
import GameBoard from "./GameBoard";
import setAppHTML from "./setAppHTML";

export default class GameBoardPlayable extends GameBoard {
  public static setScene(interactor: Interactor, router: (path: string) => void): void {
    setAppHTML(`
      <div id="moves-counter"></div>
      <div id="canvas-container"></div>
      <div id="level-selection"></div>
    `);
    new GameBoardPlayable(interactor, router);
  }

  private MovesCounterComponent: MovesCounter;
  private LevelSelectorComponent: LevelSelector;

  constructor(interactor: Interactor, router: (path: string) => void) {
    super(interactor);

    this.MovesCounterComponent = new MovesCounter();
    this.LevelSelectorComponent = new LevelSelector({
      onPrevLevel: this.goToPrevLevel.bind(this),
      onNextLevel: this.goToNextLevel.bind(this),
      onRestart: this.restartLevel.bind(this),
      onEditLevel: () => router("edit"),
    });
  }

  protected startLevel(): void {
    const state = this.interactor.startCurrentLevel(this.getPresenters());
    this.updateComponents(state);
  }

  protected HTML(props: {}): string {
    return `
      <div class="${this.innerWrapperClass}">
        <canvas class="${this.selectionCanvasClass}"></canvas>
        <canvas class="${this.tileCanvasClass}"></canvas>
      </div>
  `;
  }

  protected processSelectionStart(x: number, y: number): void {
    this.interactor.setSelectionStart(...this.getSelectionArguments(x, y));
  }

  protected processSelectionMove(x: number, y: number): void {
    this.interactor.setSelectionEnd(...this.getSelectionArguments(x, y));
  }

  protected processSelectionEnd(): void {
    const level = this.interactor.processSelection();
    this.interactor.removeSelection();
    this.updateComponents(level);
  }

  protected updateComponents(level: ILevelData): void {
    this.MovesCounterComponent.render({
      selectionsLeft: level.selections.left,
      selectionsMade: level.selections.made,
      isLevelCleared: level.isCleared,
    });

    this.LevelSelectorComponent.render({
      currentLevel: level.name,
      isFirstLevel: level.isFirstLevel,
      isLastLevel: level.isLastLevel,
      isEditing: false,
      isReviewing: level.isCustom,
    });

    this.checkIfLevelHasEnded(level);
  }

  private getSelectionArguments = (x: number, y: number): [number, number] => [
    this.convertAbsoluteOffsetToProcent(x),
    this.convertAbsoluteOffsetToProcent(y),
  ];

  private checkIfLevelHasEnded(level: ILevelData): void {
    const timeout = (func: () => void) => setTimeout(func.bind(this), 500);

    if (this.shouldProcedeToNextLevel(level)) timeout(this.goToNextLevel);
    else if (this.shouldRestartCurrentLevel(level)) timeout(this.restartLevel);
  }

  private shouldProcedeToNextLevel({ isCleared, isLastLevel, isCustom }: ILevelData): boolean {
    return isCleared && !isLastLevel && !isCustom;
  }

  private shouldRestartCurrentLevel(level: ILevelData): boolean {
    return level.selections.left === 0;
  }
}
