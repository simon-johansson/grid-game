import GridPoint from "./Logic/GridPoint";
import CanvasProvider from "./Presentation/CanvasProvider";
import SelectionPresenter from "./Presentation/SelectionPresenter";

export interface ISelectionPresenter {
  render: (selection: Selection) => void;
}

interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Selection {
  private mouseDown: boolean = false;
  private presenter: SelectionPresenter = new SelectionPresenter();
  private rect: IRect;
  private canvasSize: number = CanvasProvider.Instance.canvasSize;
  private numberOfRowsAndCols: number = 5;

  public start(x: number, y: number): void {
    this.mouseDown = true;
    this.rect = { x, y, width: 0, height: 0 };
    this.presenter.render(this);
  }

  public move(mouseX: number, mouseY: number): void {
    if (this.mouseDown) {
      this.rect.width = mouseX - this.rect.x;
      this.rect.height = mouseY - this.rect.y;
      this.presenter.render(this);
    }
  }

  public stop(): void {
    this.mouseDown = false;
    this.presenter.clear();
  }

  public getGridSpan(): [GridPoint, GridPoint] {
    let { x: startX, y: startY } = this.rect;
    let endX = startX + this.rect.width;
    let endY = startY + this.rect.height;
    const convertPxToTile = (px: number) => Math.floor((px / this.canvasSize) * this.numberOfRowsAndCols);

    if (startX > endX) {
      const tempX = startX;
      startX = endX;
      endX = tempX;
    }
    if (startY > endY) {
      const tempY = startY;
      startY = endY;
      endY = tempY;
    }

    return [
      new GridPoint(convertPxToTile(startY), convertPxToTile(startX)),
      new GridPoint(convertPxToTile(endY), convertPxToTile(endX))
    ];
  }
}
