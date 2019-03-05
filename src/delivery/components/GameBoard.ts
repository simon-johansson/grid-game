import Interactor, { IPresenters } from "../../application/Interactor";
import { IGameLevel, ILevelData } from "../../application/interfaces";
import { getSelectionPresenter, getTilePresenter } from "../game_presenters/index";
import Component from "./Component";

// TODO: Ändra ordningen av metoderna, bör vara logiskt
// TODO: Vad är protecterd? Behöver det vara det?
// TODO: Behöver jag unbind events? Memory leak?
export default abstract class GameBoard extends Component<{}> {
  protected wrapperElement: HTMLElement = document.getElementById("canvas-container");
  protected tileCanvasClass = "tile-canvas";
  protected selectionCanvasClass = "selection-canvas";
  protected innerWrapperClass = "inner-wrapper";
  protected isSelecting: boolean = false;

  constructor(
    protected interactor: Interactor,
    private customLevel: IGameLevel,
    protected onGameStateUpdate: (state: ILevelData) => void,
  ) {
    super();
    this.render({});
    this.setCanvasSize();
    this.bindEvents();
    this.interactor.loadLevels().then(() => {
      this.startLevel();
    });
  }

  public goToNextLevel() {
    this.prepareNewLevel("next");
    this.onGameStateUpdate(this.interactor.startNextLevel(this.getPresenters()));
    return this.showNewLevel("next").then(() => {
      this.bindEvents();
    });
  }

  public goToPrevLevel() {
    this.prepareNewLevel("prev");
    this.onGameStateUpdate(this.interactor.startPrevLevel(this.getPresenters()));
    return this.showNewLevel("prev").then(() => {
      this.bindEvents();
    });
  }

  public restartLevel() {
    this.prepareNewLevel("restart");
    this.startLevel();
    return this.showNewLevel("restart").then(() => {
      this.bindEvents();
    });
  }

  protected abstract HTML(props: {}): string;

  protected update(props: {}): void {
    // console.log('update');
  }

  protected abstract processSelectionStart(x: number, y: number): void;
  protected abstract processSelectionMove(x: number, y: number): void;
  protected abstract processSelectionEnd(): void;

  protected convertAbsoluteOffsetToProcent = (position: number) => Math.floor((position / this.canvasSize) * 100);

  private startLevel() {
    // TODO: Går det att göra denna kolla snyggare?
    let state;
    if (this.customLevel.layout) {
      state = this.interactor.startCustomLevel(this.getPresenters(), this.customLevel);
    } else {
      state = this.interactor.startCurrentLevel(this.getPresenters());
    }
    this.onGameStateUpdate(state);
  }

  private getPresenters(): IPresenters {
    // TODO: this.tileSize bör också vara en function, blir fel anars vid resize
    return {
      selection: getSelectionPresenter(this.selectionCanvasContext.bind(this), this.tileSize),
      tile: getTilePresenter(this.tileCanvasContext.bind(this), this.tileSize),
    };
  }

  private get tileCanvas(): HTMLCanvasElement {
    return this.getEl(this.tileCanvasClass) as HTMLCanvasElement;
  }
  private tileCanvasContext(): CanvasRenderingContext2D {
    return this.tileCanvas.getContext("2d");
  }
  private get selectionCanvas(): HTMLCanvasElement {
    return this.getEl(this.selectionCanvasClass) as HTMLCanvasElement;
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
    this.getEl(this.innerWrapperClass).className = `${this.innerWrapperClass}-old`;
    this.getEl(this.tileCanvasClass).className = `${this.tileCanvasClass}-old`;
    this.getEl(this.selectionCanvasClass).className = `${this.selectionCanvasClass}-old`;
    this.createWrapperAndCanvas(direction);
    this.setCanvasSize();
  }

  private showNewLevel(direction: "prev" | "next" | "restart"): Promise<void> {
    const oldWrapper = this.getEl(`${this.innerWrapperClass}-old`);
    const newWrapper = this.getEl(this.innerWrapperClass);

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
    wrapper.classList.add(this.innerWrapperClass, directionInClass);

    const tileCanvas = document.createElement("canvas");
    tileCanvas.className = this.tileCanvasClass;

    const selectionCanvas = document.createElement("canvas");
    selectionCanvas.className = this.selectionCanvasClass;

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

  private bindEvents(): void {
    const addCanvasListener = (eventType: string, onEventActionFn: any, proxyFn?: any) =>
      this.wrapperElement.addEventListener(
        eventType,
        proxyFn ? proxyFn.bind(this, onEventActionFn) : onEventActionFn.bind(this),
        false,
      );

    addCanvasListener("mousedown", this.onSelectionStart, this.onMouseSelection);
    addCanvasListener("mousemove", this.onSelectionMove, this.onMouseSelection);
    addCanvasListener("mouseup", this.onSelectionEnd);
    document.addEventListener("mouseup", this.onSelectionEnd, false);

    addCanvasListener("touchstart", this.onSelectionStart, this.onTouchSelection);
    addCanvasListener("touchmove", this.onSelectionMove, this.onTouchSelection);
    addCanvasListener("touchend", this.onSelectionEnd);
    document.addEventListener("touchend", this.onSelectionEnd, false);
  }

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
    this.processSelectionStart(x, y);
  };

  private onSelectionMove = (x: number, y: number): void => {
    if (this.isSelecting) {
      this.processSelectionMove(x, y);
    }
  };

  private onSelectionEnd(): void {
    if (this.isSelecting) {
      this.isSelecting = false;
      this.processSelectionEnd();
    }
  }
}
