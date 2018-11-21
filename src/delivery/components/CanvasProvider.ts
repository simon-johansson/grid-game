import Component from "./Component";

const tileCanvasClass = "tile-canvas";
const selectionCanvasClass = "selection-canvas";
const innerWrapperClass = "inner-wrapper";

export default class CanvasProvider extends Component<{}> {
  private static instance: CanvasProvider;
  protected wrapperElement: HTMLElement = document.getElementById("canvas-container");

  public get TILE_CANVAS(): HTMLCanvasElement {
    return this.getEl(tileCanvasClass) as HTMLCanvasElement;
  }
  public get TILE_CANVAS_CONTEXT(): CanvasRenderingContext2D {
    return this.TILE_CANVAS.getContext("2d");
  }
  public get SELECTION_CANVAS(): HTMLCanvasElement {
    return this.getEl(selectionCanvasClass) as HTMLCanvasElement;
  }
  public get SELECTION_CANVAS_CONTEXT(): CanvasRenderingContext2D {
    return this.SELECTION_CANVAS.getContext("2d");
  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  public get canvasSize() {
    return this.SELECTION_CANVAS.width;
  }

  public get tileSize() {
    return Math.floor(this.TILE_CANVAS.width / 5);
  }

  public get offsetTop() {
    return this.wrapperElement.offsetTop;
  }

  public get offsetLeft() {
    return this.wrapperElement.offsetLeft;
  }

  private constructor() {
    super();
    this.render({});
    this.setCanvasSize();
  }

  public prepareNewLevel(direction: 'prev' | 'next') {
    this.getEl(innerWrapperClass).className = `${innerWrapperClass}-old`;
    this.getEl(tileCanvasClass).className = `${tileCanvasClass}-old`;
    this.getEl(selectionCanvasClass).className = `${selectionCanvasClass}-old`;
    this.createWrapperAndCanvas(direction);
    this.setCanvasSize();
  }

  public showNewLevel(direction: 'prev' | 'next') {
    const oldWrapper = this.getEl(`${innerWrapperClass}-old`);
    const newWrapper = this.getEl(innerWrapperClass);

    const directionClass = direction === 'next' ? "fade-out-left" : "fade-out-right";
    oldWrapper.classList.add(directionClass);
    oldWrapper.addEventListener("transitionend", e => oldWrapper.remove(), false);

    newWrapper.classList.remove("fade-in-right", "fade-in-left");
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

    this.TILE_CANVAS.width = boardSize;
    this.TILE_CANVAS.height = boardSize;
    this.SELECTION_CANVAS.width = boardSize;
    this.SELECTION_CANVAS.height = boardSize;
    this.wrapperElement.style.width = `${boardSize}px`;
    this.wrapperElement.style.height = `${boardSize}px`;
  }

  private createWrapperAndCanvas(direction: 'prev' | 'next') {
    const wrapper = document.createElement("div");
    const directionClass = direction === 'next' ? "fade-in-right" : "fade-in-left";
    wrapper.classList.add(innerWrapperClass, directionClass);

    const tileCanvas = document.createElement("canvas");
    tileCanvas.className = tileCanvasClass;

    const selectionCanvas = document.createElement("canvas");
    selectionCanvas.className = selectionCanvasClass;

    wrapper.appendChild(tileCanvas);
    wrapper.appendChild(selectionCanvas);

    this.wrapperElement.appendChild(wrapper);
  }
}
