import GridPoint, { IGridSpan } from "../entities/GridPoint";
import { IGameRules, IGridLayout, TileType } from "./input";

export interface ITile {
  tileType: TileType;
  position: GridPoint;
  isSelected: boolean;
  isBlocker: boolean;
  isCleared: boolean;
  clearsRequired: number;
}

export interface ISelection {
  gridSpan: IGridSpan;
  isValid: boolean;
}

export interface IGameState {
  selectionsMade: {
    valid: number;
    invalid: number;
  };
  selectionsLeft: number | undefined;
  cleared: boolean;
  grid: {
    layout: IGridLayout;
    numberOfRows: number;
    numberOfCols: number;
  };
  rules: IGameRules;
}
