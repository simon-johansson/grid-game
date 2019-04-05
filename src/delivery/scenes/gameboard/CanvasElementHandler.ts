
export type NextLevelDirection = "prev" | "next" | "restart";

export default class CanvasElementHandler {
  constructor(
    private parentElement: HTMLElement,
    private wrapperClass: string,
    private tileCanvasClass: string,
    private selectionCanvasClass: string,
  ) {}

  public get tileCanvas(): HTMLCanvasElement {
    return this.parentElement.querySelector("." + this.tileCanvasClass) as HTMLCanvasElement;
  }
  public tileCanvasContext = (): CanvasRenderingContext2D => {
    return this.tileCanvas.getContext("2d") as CanvasRenderingContext2D;
  };
  public get selectionCanvas(): HTMLCanvasElement {
    return this.parentElement.querySelector("." + this.selectionCanvasClass) as HTMLCanvasElement;
  }
  public selectionCanvasContext = (): CanvasRenderingContext2D => {
    return this.selectionCanvas.getContext("2d") as CanvasRenderingContext2D;
  };

  public get canvasSize(): number {
    return this.selectionCanvas.width;
  }

  public createInitialElements(): void {
    this.parentElement.appendChild(this.createNewElements("restart"));
    this.setCanvasSize();
    this.showNewElements();
  }

  public prepareNewLevel(direction: NextLevelDirection): void {
    this.prepareToRemoveCurrentElements();
    this.parentElement.appendChild(this.createNewElements(direction));
    this.setCanvasSize();
  }

  public async showNewLevel(direction: NextLevelDirection): Promise<void> {
    this.showNewElements();
    await this.removeOldElements(direction);
  }

  private setCanvasSize(): void {
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
    this.parentElement.style.width = `${boardSize}px`;
    this.parentElement.style.height = `${boardSize}px`;
  }

  private prepareToRemoveCurrentElements(): void {
    [this.wrapperClass, this.tileCanvasClass, this.selectionCanvasClass].forEach(className => {
      const el = this.parentElement.querySelector("." + className)!;
      el.className = `${el.className}-old`;
    });
  }

  private createCanvasElement(canvasClass: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.className = canvasClass;
    return canvas;
  }

  private showNewElements(): void {
    const newWrapper = this.parentElement.querySelector(`.${this.wrapperClass}`)!;
    newWrapper!.classList.remove("fade-in", "fade-in-right", "fade-in-left");
  }

  private createNewElements(direction: NextLevelDirection): HTMLDivElement {
    const wrapper = document.createElement("div");
    let directionInClass = "fade-in";
    if (direction === "prev") directionInClass += "-left";
    else if (direction === "next") directionInClass += "-right";
    wrapper.classList.add(this.wrapperClass, directionInClass);
    wrapper.appendChild(this.createCanvasElement(this.tileCanvasClass));
    wrapper.appendChild(this.createCanvasElement(this.selectionCanvasClass));
    return wrapper;
  }

  private async removeOldElements(direction: NextLevelDirection): Promise<void> {
    const oldWrapper = this.parentElement.querySelector(`.${this.wrapperClass}-old`)!;
    let directionOutClass = "fade-out";
    if (direction === "prev") directionOutClass += "-right";
    else if (direction === "next") directionOutClass += "-left";
    oldWrapper!.classList.add(directionOutClass);
    await new Promise(resolve => oldWrapper!.addEventListener("transitionend", resolve, false));
    oldWrapper!.remove();
  }
}
