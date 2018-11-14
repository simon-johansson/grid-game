import { IPoint } from "./Selection";

export interface IGridSpan {
  startTile: GridPoint;
  endTile: GridPoint;
  tilesSpanned: number;
}

const convertPxToTile = (pxArea: number, numberOfTiles: number) => {
  // Need buffer because tile index starts at 0
  const buffer = 1;
  return (px: number) => Math.max(Math.min(Math.floor((px / (pxArea + buffer)) * numberOfTiles), numberOfTiles - 1), 0);
};

export default class GridPoint {
  public static convertPxSpanToGridSpan(startPoint: IPoint, endPoint: IPoint, numberOfRows: number): IGridSpan {
    const converter = convertPxToTile(100, numberOfRows);
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

    const startTile = new GridPoint(converter(startY), converter(startX));
    const endTile = new GridPoint(converter(endY), converter(endX));

    const rowSpan = endTile.rowIndex - startTile.rowIndex + 1;
    const colSpan = endTile.colIndex - startTile.colIndex + 1;
    const tilesSpanned = rowSpan * colSpan;

    return { startTile, endTile, tilesSpanned };
  }

  constructor(public readonly rowIndex: number, public readonly colIndex: number) {}

  public isGreaterThan(point: GridPoint): boolean {
    return this.rowIndex > point.rowIndex || this.colIndex > point.colIndex;
  }
}
