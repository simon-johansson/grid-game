import { IGameRules, ISelectionPresenter } from "../boundaries/input";
import { ISelection } from "../boundaries/output";
import GridPoint, { IGridSpan } from "./GridPoint";

export interface IPoint {
  x: number;
  y: number;
}
interface ISize {
  width: number;
  height: number;
}

export default class Selection implements ISelection {
  public gridSpan: IGridSpan;
  public isValid: boolean;

  private startPoint: IPoint;
  private endPoint: IPoint;
  private size: ISize;

  constructor(
    private rules: IGameRules,
    private numberOfRows: number,
    private numberOfCols: number,
    private presenter: ISelectionPresenter
  ) {
  }

  public setStartPoint(x: number, y: number): void {
    this.startPoint = { x, y };
    this.setGridSpan(this.startPoint);
    this.evaluate();
    this.presenter.render(this);
  }

  public setEndPoint(x: number, y: number): void {
    this.endPoint = { x, y };
    this.setSize();
    this.setGridSpan(this.startPoint, this.endPoint);
    this.evaluate();
    this.presenter.render(this);
  }

  public clear(): void {
    this.presenter.clear();
  }

  private setSize(): void {
    this.size = {
      width: this.endPoint.x - this.startPoint.x,
      height: this.endPoint.y - this.startPoint.y
    };
  }

  private setGridSpan(startPoint: IPoint, endPoint?: IPoint): void {
    this.gridSpan = GridPoint.convertPxSpanToGridSpan(
      startPoint,
      endPoint || startPoint,
      this.numberOfRows
    );
  }

  private evaluate(): void {
    this.isValid = this.rules.minSelection <= this.gridSpan.tilesSpanned ? true : false;
  }
}
