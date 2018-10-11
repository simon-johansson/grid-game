export default class GridPoint {
  constructor(public readonly rowIndex: number, public readonly colIndex: number) {}

  public isGreaterThan(point: GridPoint): boolean {
    // console.log(this.rowIndex > point.rowIndex);
    // console.log(this.colIndex > point.colIndex);

    return this.rowIndex > point.rowIndex || this.colIndex > point.colIndex;
  }
}
