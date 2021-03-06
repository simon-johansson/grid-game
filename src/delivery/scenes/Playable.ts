/* tslint:disable: no-unused-expression */
import Interactor from "@application/Interactor";
import { ILevelData } from "@application/interfaces";
import LevelSelector from "../components/LevelSelector";
import HowToPlayModal from "../components/Modals/HowToPlayModal";
import MovesCounter from "../components/MovesCounter";
import PlayableModalHelper from "../components/PlayableModalHelper";
import debounce from "../utils/debounce";
import setAppHTML from "../utils/setAppHTML";
import setAppSceneClassName from "../utils/setAppSceneClassName";
import sleep from "../utils/sleep";
import GameBoard from "./gameboard/GameBoard";

export default class Playable extends GameBoard {
  public static setScene(interactor: Interactor, router: (path: string) => void, options: { levelID: string }): void {
    setAppHTML(`
      ${MovesCounter.outerHTML}
      ${Playable.outerHTML}
      ${LevelSelector.outerHTML}
      ${HowToPlayModal.outerHTML}
    `);
    setAppSceneClassName("playable-scene");
    new Playable(interactor, router, options);
  }

  private MovesCounterComponent: MovesCounter;
  private LevelSelectorComponent: LevelSelector;
  private PlayableModalHelperComponent: PlayableModalHelper;

  constructor(interactor: Interactor, private router: (path: string) => void, options: { levelID?: string } = {}) {
    super(interactor, options.levelID);
    this.createComponents();
    window.addEventListener("resize", debounce(this.restartLevel.bind(this), 200));
    this.createHelperFunctions();
    this.startLevel(options.levelID);
  }

  protected createComponents(): void {
    this.MovesCounterComponent = new MovesCounter();

    this.LevelSelectorComponent = new LevelSelector({
      onPrevLevel: this.goToPrevLevel.bind(this),
      onNextLevel: this.goToNextLevel.bind(this),
      onRestart: this.restartLevel.bind(this),
      onEditLevel: () => this.router("edit"),
      onGoToOverview: () => this.router("overview"),
    });

    this.PlayableModalHelperComponent = new PlayableModalHelper(
      this.interactor.installer,
      this.interactor.setUserData.bind(this.interactor),
    );
  }

  protected async startLevel(levelID?: string): Promise<void> {
    let level: ILevelData;
    if (levelID) level = this.interactor.startSpecificLevel(this.getPresenters(), levelID);
    else level = this.interactor.startCurrentLevel(this.getPresenters());
    this.onNewLevel(level);
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
      minSelection: level.rules.minSelection,
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

  private async restartLevel(wait: number = 0): Promise<void> {
    return this.newLevel("restart", async () => {
      await sleep(wait);
      this.startLevel();
    });
  }

  private async goToNextLevel(wait: number = 0): Promise<void> {
    return this.newLevel("next", async () => {
      await sleep(wait);
      const level = this.interactor.startNextLevel(this.getPresenters());
      this.onNewLevel(level);
    });
  }

  private async goToPrevLevel(): Promise<void> {
    return this.newLevel("prev", async () => {
      const level = this.interactor.startPrevLevel(this.getPresenters());
      this.onNewLevel(level);
    });
  }

  private async onNewLevel(level: ILevelData): Promise<void> {
    this.updateComponents(level);
    this.PlayableModalHelperComponent.checkIfShouldShowModal(level, await this.interactor.getUserData());
  }

  private getSelectionArguments = (x: number, y: number): [number, number] => [
    this.convertAbsoluteOffsetToProcent(x),
    this.convertAbsoluteOffsetToProcent(y),
  ];

  private checkIfLevelHasEnded(level: ILevelData): void {
    if (this.shouldProcedeToNextLevel(level)) this.goToNextLevel(500);
    else if (this.shouldRestartCurrentLevel(level)) this.restartLevel(500);
  }

  private shouldProcedeToNextLevel({ isCleared, isLastLevel, isCustom }: ILevelData): boolean {
    return isCleared && !isLastLevel && !isCustom;
  }

  private shouldRestartCurrentLevel(level: ILevelData): boolean {
    return level.selections.left === 0;
  }

  private createHelperFunctions(): void {
    if ((window as any).helperFunctions === undefined) (window as any).helperFunctions = {};
    (window as any).helperFunctions.clearLevel = () => {
      this.updateComponents(this.interactor.cheatToClearLevel());
    };
  }
}
