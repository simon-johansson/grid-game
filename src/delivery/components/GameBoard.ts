import { IGameLevel, IGameRules, IGridLayout } from "../../domain/boundaries/input";
import { IGameState } from "../../domain/boundaries/output";
import GameInteractor from "../../domain/GameInteractor";
import {
  getSelectionPresenter,
  getTileBlockerPresenter,
  getTileFlippablePresenter,
  getTileMultiFlipPresenter
} from "../game_presenters/index";
import Component from "./Component";

const tileCanvasClass = "tile-canvas";
const selectionCanvasClass = "selection-canvas";
const innerWrapperClass = "inner-wrapper";

// TODO: Ändra ordningen av metoderna, bör vara logiskt
export default class CanvasProvider extends Component<{}> {
  protected wrapperElement: HTMLElement = document.getElementById("canvas-container");
  private isSelecting: boolean = false;
  private gameInteractor: GameInteractor;

  constructor(level: IGameLevel, private onGameStateUpdate: (state: IGameState) => void) {
    super();
    this.render({});
    this.setCanvasSize();
    this.bindEvents();
    this.gameInteractor = new GameInteractor(
      // TODO this.tileSize bör också vara en function, blir fel anars vid resize
      getSelectionPresenter(this.selectionCanvasContext.bind(this), this.tileSize),
      getTileFlippablePresenter(this.tileCanvasContext.bind(this), this.tileSize),
      getTileBlockerPresenter(this.tileCanvasContext.bind(this), this.tileSize),
      getTileMultiFlipPresenter(this.tileCanvasContext.bind(this), this.tileSize)
    );
    this.onGameStateUpdate(this.gameInteractor.startLevel(level));
  }

  public goToNextLevel(level: IGameLevel) {
    this.prepareNewLevel("next");
    this.onGameStateUpdate(this.gameInteractor.startLevel(level));
    return this.showNewLevel("next").then(() => {
      this.bindEvents();
    });
  }

  public goToPrevLevel(level: IGameLevel) {
    this.prepareNewLevel("prev");
    this.onGameStateUpdate(this.gameInteractor.startLevel(level));
    return this.showNewLevel("prev").then(() => {
      this.bindEvents();
    });
  }

  public restartLevel(level: IGameLevel) {
    this.prepareNewLevel("restart");
    this.onGameStateUpdate(this.gameInteractor.startLevel(level));
    return this.showNewLevel("restart").then(() => {
      this.bindEvents();
    });
  }

  protected HTML(props: {}): string {
    return `
      <div class="${innerWrapperClass}">
        <canvas class="${selectionCanvasClass}"></canvas>
        <canvas class="${tileCanvasClass}"></canvas>
      </div>
  `;
  }

  protected update(props: {}): void {
    // console.log('update');
  }

  private get tileCanvas(): HTMLCanvasElement {
    return this.getEl(tileCanvasClass) as HTMLCanvasElement;
  }
  private tileCanvasContext(): CanvasRenderingContext2D {
    return this.tileCanvas.getContext("2d");
  }
  private get selectionCanvas(): HTMLCanvasElement {
    return this.getEl(selectionCanvasClass) as HTMLCanvasElement;
  }
  private selectionCanvasContext(): CanvasRenderingContext2D {
    return this.selectionCanvas.getContext("2d");
  }

  private get canvasSize(): number {
    return this.selectionCanvas.width;
  }

  // TODO: Gör detta dynamiskt, har tillgång till gamestate
  private get tileSize(): number {
    return Math.floor(this.tileCanvas.width / 5);
  }

  private prepareNewLevel(direction: "prev" | "next" | "restart") {
    this.getEl(innerWrapperClass).className = `${innerWrapperClass}-old`;
    this.getEl(tileCanvasClass).className = `${tileCanvasClass}-old`;
    this.getEl(selectionCanvasClass).className = `${selectionCanvasClass}-old`;
    this.createWrapperAndCanvas(direction);
    this.setCanvasSize();
  }

  private showNewLevel(direction: "prev" | "next" | "restart"): Promise<void> {
    const oldWrapper = this.getEl(`${innerWrapperClass}-old`);
    const newWrapper = this.getEl(innerWrapperClass);

    let directionOutClass = "fade-out";
    if (direction === "prev") {
      directionOutClass += "-right";
    } else if (direction === "next") {
      directionOutClass += "-left";
    }

    newWrapper.classList.remove("fade-in", "fade-in-right", "fade-in-left");

    // TODO: Gör kollen på den nya wrappern istället
    const promise = new Promise(resolve => {
      oldWrapper.addEventListener("transitionend", resolve, false);
    }).then(() => oldWrapper.remove());
    oldWrapper.classList.add(directionOutClass);

    return promise;
  }

  private createWrapperAndCanvas(direction: "prev" | "next" | "restart") {
    const wrapper = document.createElement("div");
    let directionInClass = "fade-in";
    if (direction === "prev") {
      directionInClass += "-left";
    } else if (direction === "next") {
      directionInClass += "-right";
    }
    wrapper.classList.add(innerWrapperClass, directionInClass);

    const tileCanvas = document.createElement("canvas");
    tileCanvas.className = tileCanvasClass;

    const selectionCanvas = document.createElement("canvas");
    selectionCanvas.className = selectionCanvasClass;

    wrapper.appendChild(tileCanvas);
    wrapper.appendChild(selectionCanvas);

    this.wrapperElement.appendChild(wrapper);
  }

  private setCanvasSize() {
    const { clientWidth, clientHeight } = document.body;
    const mediaQuerySmall = 768;
    const defaultGameBoardSize = 500;
    let boardSize: number;

    if (clientWidth >= mediaQuerySmall) {
      boardSize = defaultGameBoardSize;
    } else {
      boardSize = Math.min(Math.max(clientWidth / 1.1), clientHeight / 1.5);
    }

    this.tileCanvas.width = boardSize;
    this.tileCanvas.height = boardSize;
    this.selectionCanvas.width = boardSize;
    this.selectionCanvas.height = boardSize;
    this.wrapperElement.style.width = `${boardSize}px`;
    this.wrapperElement.style.height = `${boardSize}px`;
  }

  private bindEvents = (): void => {
    const addCanvasListener = (eventType: string, onEventActionFn: any, proxyFn?: any) =>
      this.wrapperElement.addEventListener(
        eventType,
        proxyFn ? proxyFn.bind(this, onEventActionFn) : onEventActionFn,
        false
      );

    addCanvasListener("mousedown", this.onSelectionStart, this.onMouseSelection);
    addCanvasListener("mousemove", this.onSelectionMove, this.onMouseSelection);
    addCanvasListener("mouseup", this.onSelectionEnd);
    document.addEventListener("mouseup", this.onSelectionEnd, false);

    addCanvasListener("touchstart", this.onSelectionStart, this.onTouchSelection);
    addCanvasListener("touchmove", this.onSelectionMove, this.onTouchSelection);
    addCanvasListener("touchend", this.onSelectionEnd);
    document.addEventListener("touchend", this.onSelectionEnd, false);
  };

  private onMouseSelection = (method: (x: number, y: number) => void, e: MouseEvent): void => {
    method(e.offsetX, e.offsetY);
  };

  private onTouchSelection = (method: (x: number, y: number) => void, e: TouchEvent): void => {
    e.preventDefault();
    const offsetTop = this.wrapperElement.offsetTop;
    const offsetLeft = this.wrapperElement.offsetLeft;
    method(Math.floor(e.touches[0].clientX - offsetLeft), Math.floor(e.touches[0].clientY - offsetTop));
  };

  private onSelectionStart = (x: number, y: number): void => {
    this.isSelecting = true;
    this.gameInteractor.setSelectionStart(
      this.convertAbsoluteOffsetToProcent(x),
      this.convertAbsoluteOffsetToProcent(y)
    );
  };

  private onSelectionMove = (x: number, y: number): void => {
    if (this.isSelecting) {
      this.gameInteractor.setSelectionEnd(
        this.convertAbsoluteOffsetToProcent(x),
        this.convertAbsoluteOffsetToProcent(y)
      );
    }
  };

  private onSelectionEnd = (): void => {
    if (this.isSelecting) {
      this.isSelecting = false;
      this.onGameStateUpdate(this.gameInteractor.evaluateSelection());
    }
  };

  private convertAbsoluteOffsetToProcent = (position: number) => Math.floor((position / this.canvasSize) * 100);
}
