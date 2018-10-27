import { IGridSpan } from "../GridPoint";

export interface ISelection {
  gridSpan: IGridSpan;
  isValid: boolean;
  tileSize: number;
}
