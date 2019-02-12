import GridPoint, { IGridSpan } from "../entities/GridPoint";
import { IGameLevel, IGameRules, IGridLayout, TileType } from "./input";

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

export interface ILevel {
  selections: {
    availableFromStart: number;
    left: number;
    made: {
      valid: number;
      invalid: number;
    };
  };
  isLastLevel: boolean;
  index: number;
  cleared: boolean;
  rules: IGameRules;
  minified: IGameLevel;
}
