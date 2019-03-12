import TilePosition from "./TilePosition";

export interface ICoordinates {
  x: number;
  y: number;
}

const convertGridPercentageOffsetToTilePosition = (numberOfTiles: number) => {
  return (px: number) => {
    const position = Math.floor((px / 100) * numberOfTiles);
    const preventOutOfBounds = Math.min(Math.max(position, 0), numberOfTiles - 1);
    return preventOutOfBounds;
  };
};

export default class TileSpan {
  public static fromAbsoluteCoordinates(
    startPoint: ICoordinates,
    endPoint: ICoordinates,
    numberOfRows: number,
  ): TileSpan {
    const converter = convertGridPercentageOffsetToTilePosition(numberOfRows);
    let { x: startX, y: startY } = startPoint;
    let { x: endX, y: endY } = endPoint;

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

    const startTile = new TilePosition(converter(startY), converter(startX));
    const endTile = new TilePosition(converter(endY), converter(endX));

    return new TileSpan(startTile, endTile);
  }
  constructor(public readonly startTile: TilePosition, public readonly endTile: TilePosition) {}

  public isCovering(position: TilePosition): boolean {
    const { rowIndex, colIndex } = position;
    const rowIntersect = this.startTile.rowIndex <= rowIndex && this.endTile.rowIndex >= rowIndex;
    const colIntersect = this.startTile.colIndex <= colIndex && this.endTile.colIndex >= colIndex;
    return rowIntersect && colIntersect;
  }
}
