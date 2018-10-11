// import { GAME_BOARD_COLS, GAME_BOARD_ROWS } from "./consts";
import { gameBoardLayouts } from "./gameBoardSetup";
import GameBoardLogic, { IGameBoardLayout } from "./Logic/GameBoard";
import TileFactory from "./Logic/TileFactory";
import CanvasProvider from "./Presentation/CanvasProvider";
import TileBlockerPresenter from "./Presentation/TileBlockerPresenter";
import TileFlippablePresenter from "./Presentation/TileFlippablePresenter";
import Selection from "./Selection";
import { getQueryStringParams, getTransitionSteps } from "./utils";

const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

class App {
  private selection: Selection = new Selection();
  private mouseIsDown: boolean = false;
  private queryStringParams: any = getQueryStringParams(window.location.search);
  private queryStringLayout: IGameBoardLayout;
  private currentLevel: number = 0;
  private movesMade: number = 0;
  private gameBoard: GameBoardLogic;
  private canvasProvider: CanvasProvider = CanvasProvider.Instance;
  private $elOptimalMoves: HTMLElement = document.getElementById("optimal");
  private $elTurnsMade: HTMLElement = document.getElementById("turns");
  private $elNextBtn: HTMLElement = document.getElementById("next");

  public init = (): void => {
    this.setCanvasSize();
    this.bindEvents();
    this.analyseQueryString();
    this.createGameBoard();
    this.setGameInfo();
  };

  private setCanvasSize() {}

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
    this.canvasProvider.SELECTION_CANVAS.addEventListener("mouseup", this.onSelectionStop, false);
    this.canvasProvider.SELECTION_CANVAS.addEventListener("touchend", this.onSelectionStop, false);
    this.$elNextBtn.addEventListener("click", this.goTonextLevel, false);
  };

  private analyseQueryString = (): void => {
    try {
      this.queryStringLayout = JSON.parse(this.queryStringParams.layout) as IGameBoardLayout;
    } catch (error) {}

    try {
      this.currentLevel = JSON.parse(this.queryStringParams.level) as number;
    } catch (error) {}
  };

  private createGameBoard = (): void => {
    const rules = {
      toggleOnOverlap: true
    };
    const tileFactory = new TileFactory(rules, TileFlippablePresenter, TileBlockerPresenter);
    const tiles = tileFactory.parseRawTiles(this.getGameBoardLayout());
    this.gameBoard = new GameBoardLogic(tiles, rules);
  };

  private setGameInfo = (): void => {
    if (this.currentLevel >= gameBoardLayouts.length - 1) {
      this.$elNextBtn.style.display = "none";
    }
    this.$elOptimalMoves.textContent =
      !!gameBoardLayouts[this.currentLevel] && !this.queryStringLayout
        ? gameBoardLayouts[this.currentLevel].optimalMoves
        : "??";
  };

  private updateGameInfo = (): void => {
    this.$elTurnsMade.textContent = `${++this.movesMade}`;
  };

  private getGameBoardLayout = (): IGameBoardLayout => {
    return this.queryStringLayout || gameBoardLayouts[this.currentLevel].layout;
  };

  private onMouseSelection = (method: (x: number, y: number) => void, e: MouseEvent): void => {
    method(e.offsetX, e.offsetY);
  };

  private onTouchSelection = (method: (x: number, y: number) => void, e: TouchEvent): void => {
    const offsetLeft = this.canvasProvider.offsetLeft;
    const offsetTop = this.canvasProvider.offsetTop;
    method(Math.floor(e.touches[0].clientX - offsetLeft), Math.floor(e.touches[0].clientY - offsetTop));
  };

  private onSelectionStart = (x: number, y: number): void => {
    this.mouseIsDown = true;
    this.selection.start(x, y);
    this.gameBoard.setSelection(this.selection.getGridSpan());
  };

  private onSelectionMove = (x: number, y: number): void => {
    if (this.mouseIsDown) {
      this.selection.move(x, y);
      this.gameBoard.setSelection(this.selection.getGridSpan());
    }
  };

  private onSelectionStop = (): void => {
    this.mouseIsDown = false;
    this.gameBoard.evaluateSelection();
    this.updateGameInfo();
    this.selection.stop();
  };

  private goTonextLevel = (): void => {
    window.location.href = `${window.location.origin}?level=${this.currentLevel + 1}`;
  };
}

const app = new App();
app.init();
