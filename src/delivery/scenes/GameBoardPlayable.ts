/* tslint:disable: no-unused-expression */
import Interactor from "@application/Interactor";
import { ILevelData, IUserInformation } from "@application/interfaces";
import HowToPlayModal from "../components/HowToPlayModal";
import LevelSelector from "../components/LevelSelector";
import MinSelectionModal from "../components/MinSelectionModal";
import MovesCounter from "../components/MovesCounter";
import GameBoard from "./GameBoard";
import setAppHTML from "./setAppHTML";

export default class GameBoardPlayable extends GameBoard {
  public static setScene(interactor: Interactor, router: (path: string) => void, options: { levelID: string }): void {
    setAppHTML(`
      <div id="header">
        <div class="tab-button go-to-overview">Overview</div>
      </div>
      <div id="moves-counter"></div>
      <div id="canvas-container"></div>
      <div id="level-selection"></div>
      <div id="modal"></div>
    `);
    new GameBoardPlayable(interactor, router, options);
  }

  private MovesCounterComponent: MovesCounter;
  private LevelSelectorComponent: LevelSelector;
  private HowToPlayModalComponent: HowToPlayModal;
  private MinSelectionModalComponent: MinSelectionModal;

  constructor(interactor: Interactor, private router: (path: string) => void, options: { levelID?: string } = {}) {
    super(interactor, options.levelID);

    this.MovesCounterComponent = new MovesCounter();
    this.LevelSelectorComponent = new LevelSelector({
      onPrevLevel: this.goToPrevLevel.bind(this),
      onNextLevel: this.goToNextLevel.bind(this),
      onRestart: this.restartLevel.bind(this),
      onEditLevel: () => router("edit"),
    });

    this.HowToPlayModalComponent = new HowToPlayModal();
    this.MinSelectionModalComponent = new MinSelectionModal(() => {
      this.interactor.setUserData({
        hasViewedMinSelectionInfo: true,
      });
    });

    (window as any).helperFunctions.clearLevel = () => {
      this.updateComponents(this.interactor.cheatToClearLevel());
    };
  }

  protected async startLevel(levelID?: string): Promise<void> {
    let level: ILevelData;
    if (levelID) level = this.interactor.startSpecificLevel(this.getPresenters(), levelID);
    else level = this.interactor.startCurrentLevel(this.getPresenters());
    this.updateComponents(level);
    this.checkIfShouldShowModal(level, await this.interactor.getUserData());
  }

  protected HTML(props: {}): string {
    return `
      <div class="${this.innerWrapperClass}">
        <canvas class="${this.selectionCanvasClass}"></canvas>
        <canvas class="${this.tileCanvasClass}"></canvas>
      </div>
  `;
  }

  protected componentDidMount(): void {
    // TODO: Gör snyggare, kanske borde vara i en komponent som heter Header
    document.querySelector(".go-to-overview")!.addEventListener("click", () => this.router("overview"));
  }

  protected processSelectionStart(x: number, y: number): void {
    this.interactor.setSelectionStart(...this.getSelectionArguments(x, y));
  }

  protected processSelectionMove(x: number, y: number): void {
    this.interactor.setSelectionEnd(...this.getSelectionArguments(x, y));
  }

  protected processSelectionEnd(): void {
    const level = this.interactor.processSelection();
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

  protected async goToNextLevel(): Promise<void> {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      this.prepareNewLevel("next");
      const level = this.interactor.startNextLevel(this.getPresenters());
      this.updateComponents(level);
      this.checkIfShouldShowModal(level, await this.interactor.getUserData());
      return this.showNewLevel("next").then(() => {
        this.bindEvents();
        this.isTransitioningBetweenLevels = false;
      });
    }
  }

  protected async goToPrevLevel(): Promise<void> {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      this.prepareNewLevel("prev");
      const level = this.interactor.startPrevLevel(this.getPresenters());
      this.updateComponents(level);
      this.checkIfShouldShowModal(level, await this.interactor.getUserData());
      return this.showNewLevel("prev").then(() => {
        this.bindEvents();
        this.isTransitioningBetweenLevels = false;
      });
    }
  }

  private getSelectionArguments = (x: number, y: number): [number, number] => [
    this.convertAbsoluteOffsetToProcent(x),
    this.convertAbsoluteOffsetToProcent(y),
  ];

  private checkIfShouldShowModal(level: ILevelData, userInfo: IUserInformation): void {
    const timeout = (func: () => void) => setTimeout(func.bind(this), 500);

    if (this.shouldShowHowToPlayModal(level)) {
      timeout(() => this.HowToPlayModalComponent.render({}));
    }

    if (this.shouldShowMinSelectionModal(level, userInfo)) {
      timeout(() => this.MinSelectionModalComponent.render({}));
    }
  }

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

  private shouldShowHowToPlayModal({ isFirstLevel, isCleared }: ILevelData): boolean {
    return isFirstLevel !== undefined && isFirstLevel && !isCleared;
  }

  private shouldShowMinSelectionModal(level: ILevelData, userInfo: IUserInformation): boolean {
    return level.rules.minSelection > 1 && !userInfo.hasViewedMinSelectionInfo;
  }
}
