import GridPoint, { IGridSpan } from "./GridPoint";

export interface ISelectionPresentationData {
  gridSpan: IGridSpan;
  isValid: boolean;
}

export interface ISelectionPresenter {
  render: (selection: ISelectionPresentationData) => void;
  clear: () => void;
}

export interface IPoint {
  x: number;
  y: number;
}

interface ISize {
  width: number;
  height: number;
}

export default class Selection {
  public gridSpan: IGridSpan;

  private startPoint: IPoint;
  private endPoint: IPoint;
  private valid: boolean = true;
  private size: ISize;

  constructor(private rows: number, private cols: number, private presenter: ISelectionPresenter) {}

  public setStartPoint(x: number, y: number): void {
    this.startPoint = { x, y };
    this.setGridSpan(this.startPoint);
    this.presenter.render(this);
  }

  public setEndPoint(x: number, y: number): void {
    this.endPoint = { x, y };
    this.setSize();
    this.setGridSpan(this.startPoint, this.endPoint);
    this.presenter.render(this);
  }

  public clear(): void {
    this.presenter.clear();
  }

  public get isValid(): boolean {
    return this.valid;
  }

  public set isValid(bool: boolean) {
    this.valid = bool;
    this.presenter.render(this);
  }

  private setSize(): void {
    this.size = {
      width: this.endPoint.x - this.startPoint.x,
      height: this.endPoint.y - this.startPoint.y,
    };
  }

  private setGridSpan(startPoint: IPoint, endPoint?: IPoint): void {
    this.gridSpan = GridPoint.convertPxSpanToGridSpan(startPoint, endPoint || startPoint, this.rows);
  }
}
