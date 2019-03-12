import { getTilePresenter } from "@shared/__tests__/testUtils";
import Rules from "../Rules";
import Tile, { ITilePresentationData, TileType } from "../Tile";
import TilePosition from "../TilePosition";
import TileSpan from "../TileSpan";

describe("Tile", () => {
  let timesRendered: number = 0;
  let tile: Tile;
  const selectedSpan = TileSpan.fromAbsoluteCoordinates({ x: 0, y: 0 }, { x: 100, y: 100 }, 5);
  const deselectedSpan = TileSpan.fromAbsoluteCoordinates({ x: 50, y: 50 }, { x: 100, y: 100 }, 5);
  const position = new TilePosition(0, 0);
  const rules = new Rules();
  const presenter = getTilePresenter((tileData: ITilePresentationData) => {
    timesRendered++;
  });

  describe("#toggleCleared", () => {
    beforeEach(() => {
      tile = new Tile(TileType.Regular, position, rules, new presenter());
    });

    test("can clear if clearable", () => {
      tile.toggleCleared();
      expect(tile.isCleared).toEqual(true);
    });

    test("can unclear if clearable", () => {
      tile.toggleCleared();
      tile.toggleCleared();
      expect(tile.isCleared).toEqual(false);
    });

    test("can not clear if not clearable", () => {
      const blocker = new Tile(TileType.Blocker, position, rules, new presenter());
      blocker.toggleCleared();
      expect(tile.isCleared).toEqual(false);
    });
  });

  describe("#deselect", () => {
    beforeEach(() => {
      tile = new Tile(TileType.Regular, position, rules, new presenter());
    });

    test("can deselect if selected", () => {
      tile.applySelection(selectedSpan);
      tile.deselect();
      expect(tile.isSelected).toEqual(false);
    });
  });

  describe(".isClearable", () => {
    beforeEach(() => {
      tile = new Tile(TileType.Regular, position, rules, new presenter());
    });

    test("true if not blocker & toggle is allowed", () => {
      expect(tile.isClearable).toEqual(true);
      tile.toggleCleared();
      expect(tile.isClearable).toEqual(true);
    });

    test("true if not cleared and toggle is not allowed", () => {
      const noToggle = new Rules({ toggleOnOverlap: false });
      tile = new Tile(TileType.Regular, position, noToggle, new presenter());
      expect(tile.isClearable).toEqual(true);
    });

    test("false if cleared and toggle is not allowed", () => {
      const noToggle = new Rules({ toggleOnOverlap: false });
      tile = new Tile(TileType.Regular, position, noToggle, new presenter());
      tile.toggleCleared();
      expect(tile.isClearable).toEqual(false);
    });

    test("false if blocker", () => {
      const blocker = new Tile(TileType.Blocker, position, rules, new presenter());
      expect(blocker.isClearable).toEqual(false);
    });
  });

  describe("#applySelection", () => {
    beforeEach(() => {
      tile = new Tile(TileType.Regular, position, rules, new presenter());
    });

    test("selected if covered by selection", () => {
      tile.applySelection(selectedSpan);
      expect(tile.isSelected).toEqual(true);
    });

    test("not selected if not covered by selection", () => {
      tile.applySelection(selectedSpan);
      tile.applySelection(deselectedSpan);
      expect(tile.isSelected).toEqual(false);
    });

    test("change tile type if supplied and is covered by selection", () => {
      tile.applySelection(selectedSpan, TileType.Cleared);
      expect(tile.isCleared).toEqual(true);
      tile.applySelection(selectedSpan, TileType.Blocker);
      expect(tile.isBlocker).toEqual(true);
      tile.applySelection(selectedSpan, TileType.Regular);
      expect(tile.isBlocker).toEqual(false);
      expect(tile.isCleared).toEqual(false);
    });

    test("not change tile type if supplied but not covered by selection", () => {
      tile.applySelection(deselectedSpan, TileType.Cleared);
      expect(tile.isCleared).toEqual(false);
      tile.applySelection(deselectedSpan, TileType.Blocker);
      expect(tile.isBlocker).toEqual(false);
    });
  });

  describe("call presenter on new state", () => {
    beforeEach(() => {
      timesRendered = 0;
      tile = new Tile(TileType.Regular, position, rules, new presenter());
    });

    test("on creation", () => {
      expect(timesRendered).toEqual(1);
    });

    test("on #toggleCleared()", () => {
      tile.toggleCleared();
      expect(timesRendered).toEqual(2);
    });

    test("on selected", () => {
      tile.applySelection(selectedSpan);
      expect(timesRendered).toEqual(2);
    });

    test("on deselected", () => {
      tile.applySelection(selectedSpan);
      tile.applySelection(deselectedSpan);
      expect(timesRendered).toEqual(3);
    });

    test("on #deselect()", () => {
      tile.applySelection(selectedSpan);
      tile.deselect();
      expect(timesRendered).toEqual(3);
    });

    test("on type edit", () => {
      tile.applySelection(selectedSpan, TileType.Blocker);
      expect(timesRendered).toEqual(2);
    });
  });
});
