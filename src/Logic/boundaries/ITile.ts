import GridPoint from "../GridPoint";

export interface ITile {
  position: GridPoint;
  isSelected: boolean;
  isBlocker: boolean;
  isCleared: boolean;
  clearsRequired: number;
}
