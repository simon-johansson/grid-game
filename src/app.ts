// import { GAME_BOARD_COLS, GAME_BOARD_ROWS } from "./consts";
import { gameBoardLayouts } from "./levels";
import {
  IGameLevel,
  IGameRules,
  IGridLayout,
  ISelectionPresenterConstructor,
  ITilePresenterConstructor
} from "./Logic/boundaries";
import GameInteractor from "./Logic/GameInteractor";
// import GameBoardLogic from "./Logic/Grid";
// import Selection from "./Logic/Selection";
// import TileFactory from "./Logic/TileFactory";
import CanvasProvider from "./Presentation/CanvasProvider";
import SelectionPresenter from "./Presentation/SelectionPresenter";
import TileBlockerPresenter from "./Presentation/TileBlockerPresenter";
import TileFlippablePresenter from "./Presentation/TileFlippablePresenter";
import TileMultiFlipPresenter from "./Presentation/TileMultiFlipPresenter";
import { getQueryStringParams } from "./utils";

class App {
  private gameInteractor: GameInteractor = new GameInteractor(
    CanvasProvider.Instance.canvasSize,
    SelectionPresenter,
    TileFlippablePresenter,
    TileBlockerPresenter,
    TileMultiFlipPresenter
  );
  private defaultRules: IGameRules = {};
  private mouseIsDown: boolean = false;
  private queryStringParams: any = getQueryStringParams(window.location.search);
  private queryStringLayout: IGridLayout;
  private currentLevel: number = 0;
  private movesMade: number = 0;
  private canvasProvider: CanvasProvider = CanvasProvider.Instance;
  private $elMovesLeft: HTMLElement = document.getElementById("moves-left");
  private $elMovesMade: HTMLElement = document.getElementById("moves-made");
  private $elNextBtn: HTMLElement = document.getElementById("next");

  public init = (): void => {
    this.bindEvents();
    this.analyseQueryString();
    this.createGame();
    this.setGameInfo();
  };

  private bindEvents = (): void => {
    this.canvasProvider.SELECTION_CANVAS.addEventListener(
      "mousedown",
      this.onMouseSelection.bind(this, this.onSelectionStart),
      false
    );
    this.canvasProvider.SELECTION_CANVAS.addEventListener(
      "mousemove",
      this.onMouseSelection.bind(this, this.onSelectionMove),
      false
    );
    this.canvasProvider.SELECTION_CANVAS.addEventListener(
      "touchstart",
      this.onTouchSelection.bind(this, this.onSelectionStart),
      false
    );
    this.canvasProvider.SELECTION_CANVAS.addEventListener(
      "touchmove",
      this.onTouchSelection.bind(this, this.onSelectionMove),
      false
    );
    this.canvasProvider.SELECTION_CANVAS.addEventListener("mouseup", this.onSelectionEnd, false);
    this.canvasProvider.SELECTION_CANVAS.addEventListener("touchend", this.onSelectionEnd, false);
    this.$elNextBtn.addEventListener("click", this.goTonextLevel, false);
  };

  private analyseQueryString = (): void => {
    try {
      this.queryStringLayout = JSON.parse(this.queryStringParams.layout) as IGridLayout;
    } catch (error) {}

    try {
      this.currentLevel = JSON.parse(this.queryStringParams.level) as number;
    } catch (error) {}

    try {
      this.defaultRules.toggleOnOverlap = JSON.parse(this.queryStringParams.toggleOnOverlap) as boolean;
    } catch (error) {}

    try {
      this.defaultRules.minSelection = JSON.parse(this.queryStringParams.minSelection) as number;
    } catch (error) {}
  };

  private createGame = (): void => {
    const level = this.getGameBoardLayout();
    level.rules = level.rules || {};
    Object.assign(level.rules, this.defaultRules);

    this.gameInteractor.startLevel(level);
  };

  private setGameInfo = (): void => {
    if (this.currentLevel >= gameBoardLayouts.length - 1) {
      this.$elNextBtn.style.display = "none";
    }

    if (!!gameBoardLayouts[this.currentLevel] && !this.queryStringLayout) {
      this.$elMovesLeft.textContent = `${gameBoardLayouts[this.currentLevel].moves}`;
      this.$elMovesMade.style.display = "none";
    } else {
      this.$elMovesLeft.style.display = "none";
    }
  };

  private updateGameInfo = (gameState: any): void => {
    if (typeof gameState.selectionsLeft === "undefined") {
      this.$elMovesMade.textContent = `${gameState.selectionsMade.valid}`;
    } else {
      this.$elMovesLeft.textContent = `${gameState.selectionsLeft}`;
    }
  };

  private getGameBoardLayout = (): IGameLevel => {
    if (this.queryStringLayout) {
      return {
        layout: this.queryStringLayout
      };
    } else {
      return gameBoardLayouts[this.currentLevel];
    }
  };

  private onMouseSelection = (method: (x: number, y: number) => void, e: MouseEvent): void => {
    method(e.offsetX, e.offsetY);
  };

  private onTouchSelection = (method: (x: number, y: number) => void, e: TouchEvent): void => {
    e.preventDefault();
    const offsetLeft = this.canvasProvider.offsetLeft;
    const offsetTop = this.canvasProvider.offsetTop;
    method(Math.floor(e.touches[0].clientX - offsetLeft), Math.floor(e.touches[0].clientY - offsetTop));
  };

  private onSelectionStart = (x: number, y: number): void => {
    this.mouseIsDown = true;
    this.gameInteractor.setSelectionStart(x, y);
  };

  private onSelectionMove = (x: number, y: number): void => {
    if (this.mouseIsDown) {
      this.gameInteractor.setSelectionEnd(x, y);
    }
  };

  private onSelectionEnd = (): void => {
    this.mouseIsDown = false;
    const gameState = this.gameInteractor.evaluateSelection();
    this.updateGameInfo(gameState);

    if (gameState.cleared && !(this.currentLevel >= gameBoardLayouts.length - 1) && !this.queryStringLayout) {
      setTimeout(() => {
        this.goTonextLevel();
      }, 500);
      return;
    }

    if (gameState.selectionsLeft === 0) {
      setTimeout(() => {
        location.reload();
      }, 500);
      return;
    }
  };

  private goTonextLevel = (): void => {
    window.location.href = `${window.location.origin}?level=${this.currentLevel + 1}`;
  };
}

const app = new App();
app.init();
