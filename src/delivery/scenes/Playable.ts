/* tslint:disable: no-unused-expression */
import Interactor from "@application/Interactor";
import { ILevelData, IUserInformation } from "@application/interfaces";
import HowToPlayModal from "../components/HowToPlayModal";
import InstallModal from "../components/InstallModal";
import LevelSelector from "../components/LevelSelector";
import MinSelectionModal from "../components/MinSelectionModal";
import MovesCounter from "../components/MovesCounter";
import debounce from "../utils/debounce";
import GameBoard from "./gameboard/GameBoard";
import setAppHTML from "./setAppHTML";

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Playable extends GameBoard {
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
    new Playable(interactor, router, options);
  }

  private MovesCounterComponent: MovesCounter;
  private LevelSelectorComponent: LevelSelector;
  private InstallModalComponent: InstallModal;
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

    this.InstallModalComponent = new InstallModal({
      installViaButton: this.interactor.installer.canBeInstalledViaNativeInstallPromp,
      onClose: this.onCloseInstallModal.bind(this),
      onInstall: this.onInstall.bind(this),
    });

    this.HowToPlayModalComponent = new HowToPlayModal();

    this.MinSelectionModalComponent = new MinSelectionModal({
      onClose: this.onCloseMinSelectionModal.bind(this),
    });

    // TODO: Gör snyggare, kanske borde vara i en komponent som heter Header
    document.querySelector(".go-to-overview")!.addEventListener("click", () => this.router("overview"));

    window.addEventListener("resize", debounce(this.restartLevel.bind(this), 200));

    (window as any).helperFunctions.clearLevel = () => {
      this.updateComponents(this.interactor.cheatToClearLevel());
    };
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
    this.checkIfShouldShowModal(level, await this.interactor.getUserData());
  }

  private getSelectionArguments = (x: number, y: number): [number, number] => [
    this.convertAbsoluteOffsetToProcent(x),
    this.convertAbsoluteOffsetToProcent(y),
  ];

  private async checkIfShouldShowModal(level: ILevelData, userInfo: IUserInformation): Promise<void> {
    if (this.shouldShowHowToPlayModal(level)) {
      await sleep(500);
      this.HowToPlayModalComponent.render({});
    } else if (this.shouldShowMinSelectionModal(level, userInfo)) {
      await sleep(500);
      this.MinSelectionModalComponent.render({});
    } else if (this.shouldShowInstallerModal(userInfo)) {
      await sleep(500);
      this.InstallModalComponent.render({});
    }
  }

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

  private shouldShowHowToPlayModal({ isFirstLevel, isCleared }: ILevelData): boolean {
    return isFirstLevel !== undefined && isFirstLevel && !isCleared;
  }

  private shouldShowMinSelectionModal(level: ILevelData, userInfo: IUserInformation): boolean {
    return level.rules.minSelection > 1 && !userInfo.hasViewedMinSelectionInfo;
  }

  private shouldShowInstallerModal({ hasViewedInstallationInfo, clearedLevels }: IUserInformation): boolean {
    const { canBeInstalled } = this.interactor.installer;
    return canBeInstalled && !hasViewedInstallationInfo && clearedLevels >= 15;
  }

  private onCloseMinSelectionModal(): void {
    this.interactor.setUserData({
      hasViewedMinSelectionInfo: true,
    });
  }

  private onCloseInstallModal(): void {
    const isPersisted = false;
    this.interactor.setUserData(
      {
        hasViewedInstallationInfo: true,
      },
      isPersisted,
    );
    window.analytics.onCloseInstallModal();
  }

  private onInstall(): void {
    this.interactor.installer.showNativeInstallPrompt();
  }
}
