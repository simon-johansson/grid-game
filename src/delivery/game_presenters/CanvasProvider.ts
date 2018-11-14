export default class CanvasProvider {
  private static instance: CanvasProvider;

  public TILE_CANVAS = document.getElementById("tile-canvas") as HTMLCanvasElement;
  public TILE_CANVAS_CONTEXT: CanvasRenderingContext2D = this.TILE_CANVAS.getContext("2d");
  public SELECTION_CANVAS = document.getElementById("selection-canvas") as HTMLCanvasElement;
  public SELECTION_CANVAS_CONTEXT: CanvasRenderingContext2D = this.SELECTION_CANVAS.getContext("2d");

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
    // Becuase the canvas(es) are in a wrapper
    return (this.SELECTION_CANVAS.offsetParent as HTMLElement).offsetTop;
  }

  public get offsetLeft() {
    // Becuase the canvas(es) are in a wrapper
    return (this.SELECTION_CANVAS.offsetParent as HTMLElement).offsetLeft;
  }

  private constructor() {
    const clientWidth = document.body.clientWidth;
    const boardSize = clientWidth > 500 ? 500 : clientWidth;

    // console.log(boardSize);
    // console.log(window.innerWidth);
    // console.log(window.outerWidth);
    // console.log(screen.width);
    // console.log(screen.height);

    this.TILE_CANVAS.width = boardSize;
    this.TILE_CANVAS.height = boardSize;
    this.SELECTION_CANVAS.width = boardSize
    this.SELECTION_CANVAS.height = boardSize;
  }
}
