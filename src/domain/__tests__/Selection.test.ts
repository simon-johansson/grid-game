import { getSelectionPresenter, getTilePresenter } from "@shared/__tests__/testUtils";
import Selection, { ISelectionPresentationData } from "../Selection";

describe("Selection", () => {
  let timesRendered: number = 0;
  const rows = 5;
  const cols = 5;
  const presenter = getSelectionPresenter((selectionData: ISelectionPresentationData) => {
    timesRendered++;
  });
  let selection: Selection;

  describe("set size", () => {
    beforeEach(() => {
      selection = new Selection(rows, cols, new presenter());
    });

    test("setting start point results in one tile selected", () => {
      selection.setStartPoint({ x: 0, y: 0 });

      expect(selection.tileSpan!.startTile.rowIndex).toEqual(0);
      expect(selection.tileSpan!.startTile.colIndex).toEqual(0);
      expect(selection.tileSpan!.endTile.rowIndex).toEqual(0);
      expect(selection.tileSpan!.endTile.colIndex).toEqual(0);
    });

    test("setting end point results in selection span", () => {
      selection.setStartPoint({ x: 0, y: 0 });
      selection.setEndPoint({ x: 50, y: 50 });

      expect(selection.tileSpan!.startTile.rowIndex).toEqual(0);
      expect(selection.tileSpan!.startTile.colIndex).toEqual(0);
      expect(selection.tileSpan!.endTile.rowIndex).toEqual(2);
      expect(selection.tileSpan!.endTile.colIndex).toEqual(2);
    });

    test("expanding selection by setting new end point", () => {
      selection.setStartPoint({ x: 0, y: 0 });
      selection.setEndPoint({ x: 50, y: 50 });
      selection.setEndPoint({ x: 100, y: 100 });

      expect(selection.tileSpan!.startTile.rowIndex).toEqual(0);
      expect(selection.tileSpan!.startTile.colIndex).toEqual(0);
      expect(selection.tileSpan!.endTile.rowIndex).toEqual(4);
      expect(selection.tileSpan!.endTile.colIndex).toEqual(4);
    });

    test("decreasing selection by setting new end point", () => {
      selection.setStartPoint({ x: 0, y: 0 });
      selection.setEndPoint({ x: 100, y: 50 });
      selection.setEndPoint({ x: 30, y: 30 });

      expect(selection.tileSpan!.startTile.rowIndex).toEqual(0);
      expect(selection.tileSpan!.startTile.colIndex).toEqual(0);
      expect(selection.tileSpan!.endTile.rowIndex).toEqual(1);
      expect(selection.tileSpan!.endTile.colIndex).toEqual(1);
    });
  });

  describe("call presenter on new state", () => {
    beforeEach(() => {
      timesRendered = 0;
      selection = new Selection(rows, cols, new presenter());
    });

    test("#remove()", () => {
      selection.remove();
      expect(timesRendered).toEqual(1);
    });

    test("set start point", () => {
      selection.setStartPoint({ x: 0, y: 0 });
      expect(timesRendered).toEqual(1);
    });

    test("set end point", () => {
      selection.setStartPoint({ x: 0, y: 0 });
      selection.setEndPoint({ x: 100, y: 100 });
      expect(timesRendered).toEqual(2);
    });

    test("isValid change", () => {
      selection.isValid = false;
      expect(timesRendered).toEqual(1);
    });

    test("not call render when isValid is set to same thing", () => {
      selection.isValid = false;
      selection.isValid = false;
      selection.isValid = false;
      expect(timesRendered).toEqual(1);
    });
  });
});
