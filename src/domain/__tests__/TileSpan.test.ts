import TilePosition from "../TilePosition";
import TileSpan from "../TileSpan";

describe("TileSpan", () => {
  const defaultStartCoor = { x: 0, y: 0 };
  const defaultEndCoor = { x: 100, y: 100 };
  const defaultRows = 5;

  describe("#fromAbsoluteCoordinates", () => {
    beforeEach(() => {});

    test("one tile", () => {
      const tileSpan = TileSpan.fromAbsoluteCoordinates(defaultStartCoor, defaultStartCoor, defaultRows);

      expect(tileSpan.startTile.rowIndex).toEqual(0);
      expect(tileSpan.startTile.colIndex).toEqual(0);
      expect(tileSpan.endTile.rowIndex).toEqual(0);
      expect(tileSpan.endTile.colIndex).toEqual(0);
    });

    test("part of grid", () => {
      const tileSpan = TileSpan.fromAbsoluteCoordinates({ x: 20, y: 20 }, { x: 70, y: 40 }, defaultRows);

      expect(tileSpan.startTile.rowIndex).toEqual(1);
      expect(tileSpan.startTile.colIndex).toEqual(1);
      expect(tileSpan.endTile.rowIndex).toEqual(2);
      expect(tileSpan.endTile.colIndex).toEqual(3);
    });

    test("whole grid", () => {
      const tileSpan = TileSpan.fromAbsoluteCoordinates(defaultStartCoor, defaultEndCoor, defaultRows);

      expect(tileSpan.startTile.rowIndex).toEqual(0);
      expect(tileSpan.startTile.colIndex).toEqual(0);
      expect(tileSpan.endTile.rowIndex).toEqual(4);
      expect(tileSpan.endTile.colIndex).toEqual(4);
    });

    test("startTile has lower values than endTile", () => {
      const tileSpan = TileSpan.fromAbsoluteCoordinates(defaultEndCoor, defaultStartCoor, defaultRows);

      expect(tileSpan.startTile.rowIndex).toEqual(0);
      expect(tileSpan.startTile.colIndex).toEqual(0);
      expect(tileSpan.endTile.rowIndex).toEqual(4);
      expect(tileSpan.endTile.colIndex).toEqual(4);
    });
  });

  describe("#isCovering", () => {
    beforeEach(() => {});

    test("true if covering", () => {
      const tileSpan = TileSpan.fromAbsoluteCoordinates(defaultStartCoor, defaultEndCoor, defaultRows);
      expect(tileSpan.isCovering(new TilePosition(0, 0))).toEqual(true);
      expect(tileSpan.isCovering(new TilePosition(1, 2))).toEqual(true);
      expect(tileSpan.isCovering(new TilePosition(2, 3))).toEqual(true);
      expect(tileSpan.isCovering(new TilePosition(4, 4))).toEqual(true);
    });

    test("false if not covering", () => {
      const tileSpan = TileSpan.fromAbsoluteCoordinates(defaultStartCoor, defaultStartCoor, defaultRows);
      expect(tileSpan.isCovering(new TilePosition(1, 2))).toEqual(false);
      expect(tileSpan.isCovering(new TilePosition(2, 3))).toEqual(false);
      expect(tileSpan.isCovering(new TilePosition(4, 4))).toEqual(false);
    });
  });
});
