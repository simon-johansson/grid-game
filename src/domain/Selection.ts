import TileSpan, { ICoordinates } from "./TileSpan";

export interface ISelectionPresentationData {
  tileSpan: TileSpan | undefined;
  isValid: boolean;
}

export interface ISelectionPresenter {
  render: (selection: ISelectionPresentationData) => void;
}

export default class Selection {
  public tileSpan: TileSpan | undefined;
  private startPoint: ICoordinates;
  private valid: boolean = true;

  constructor(private rows: number, private cols: number, private presenter: ISelectionPresenter) {}

  public setStartPoint(gridOffsetCoordinates: ICoordinates): void {
    this.startPoint = gridOffsetCoordinates;
    this.setTileSpan(this.startPoint);
  }

  public setEndPoint(gridOffsetCoordinates: ICoordinates): void {
    this.setTileSpan(this.startPoint, gridOffsetCoordinates);
  }

  public remove(): void {
    this.tileSpan = undefined;
    this.render();
  }

  public get isValid(): boolean {
    return this.valid;
  }

  public set isValid(bool: boolean) {
    if (this.valid !== bool) {
      this.valid = bool;
      this.render();
    }
  }

  private setTileSpan(startPoint: ICoordinates, endPoint?: ICoordinates): void {
    this.tileSpan = TileSpan.fromAbsoluteCoordinates(startPoint, endPoint || startPoint, this.rows);
    this.render();
  }

  private render(): void {
    this.presenter.render(this);
  }
}
