import TileGroup from "@domain/TileGroup";
import { createTiles, get5x5TypedLayout } from "@shared/__tests__/testUtils";
import Grid from "../Grid";
import Rules from "../Rules";
import Tile, { TileType } from "../Tile";
import TilePosition from "../TilePosition";
import TileSpan from "../TileSpan";

const rules = new Rules();
const tileGroups: TileGroup[] = [];

describe("Grid", () => {
  describe("#applySelection", () => {
    let tiles: Tile[];
    let grid: Grid;

    beforeEach(() => {
      tiles = createTiles(get5x5TypedLayout(TileType.Regular));
      grid = new Grid(tiles, tileGroups, rules);
    });

    test("select one tile", () => {
      const selection = new TileSpan(new TilePosition(0, 0), new TilePosition(0, 0));
      grid.applySelection(selection);
      const selectedTile = tiles.filter(tile => tile.isSelected);
      expect(selectedTile.length).toEqual(1);
      expect(selectedTile[0].position.colIndex).toEqual(0);
      expect(selectedTile[0].position.rowIndex).toEqual(0);
    });

    test("select part of grid", () => {
      const selection = new TileSpan(new TilePosition(0, 0), new TilePosition(2, 2));
      grid.applySelection(selection);
      expect(
        tiles.filter(tile => tile.position.rowIndex <= 2 && tile.position.colIndex <= 2).every(tile => tile.isSelected),
      ).toEqual(true);
    });

    test("select whole grid", () => {
      const selection = new TileSpan(new TilePosition(0, 0), new TilePosition(4, 4));
      grid.applySelection(selection);
      expect(tiles.every(tile => tile.isSelected)).toEqual(true);
    });

    test("edit one tile", () => {
      const selection = new TileSpan(new TilePosition(0, 0), new TilePosition(0, 0));
      grid.applySelection(selection, TileType.Blocker);
      const selectedTile = tiles.filter(tile => tile.isBlocker);
      expect(selectedTile.length).toEqual(1);
    });

    test("select part of grid", () => {
      const selection = new TileSpan(new TilePosition(1, 1), new TilePosition(4, 4));
      grid.applySelection(selection, TileType.Cleared);
      expect(
        tiles.filter(tile => tile.position.rowIndex >= 1 && tile.position.colIndex >= 1).every(tile => tile.isCleared),
      ).toEqual(true);
    });
  });

  describe(".isSelectedTilesClearable", () => {
    const regularTiles = createTiles(get5x5TypedLayout(TileType.Regular));
    const blockerTiles = createTiles(get5x5TypedLayout(TileType.Blocker));
    const bigSelection = new TileSpan(new TilePosition(0, 0), new TilePosition(3, 3));
    const smallSelection = new TileSpan(new TilePosition(1, 1), new TilePosition(1, 2));
    let clearableGrid: Grid;
    let blockerGrid: Grid;

    beforeEach(() => {
      clearableGrid = new Grid(regularTiles, tileGroups, new Rules({ minSelection: 3 }));
      blockerGrid = new Grid(blockerTiles, tileGroups,  rules);
    });

    test("true if enough clearable tiles are selected", () => {
      clearableGrid.applySelection(bigSelection);
      expect(clearableGrid.isSelectedTilesClearable).toEqual(true);
    });

    test("false if blocker is selected", () => {
      blockerGrid.applySelection(bigSelection);
      expect(blockerGrid.isSelectedTilesClearable).toEqual(false);
    });

    test("false if not enough clearable tiles are selected", () => {
      clearableGrid.applySelection(smallSelection);
      expect(clearableGrid.isSelectedTilesClearable).toEqual(false);
    });
  });

  describe(".deselectTiles", () => {
    let tiles: Tile[];
    let grid: Grid;

    beforeEach(() => {
      tiles = createTiles(get5x5TypedLayout(TileType.Regular));
      grid = new Grid(tiles, tileGroups, rules);
    });

    test("deselect all tiles", () => {
      const selection = new TileSpan(new TilePosition(0, 0), new TilePosition(2, 2));
      grid.applySelection(selection);
      grid.deselectElements();
      expect(tiles.every(tile => !tile.isSelected)).toEqual(true);
    });
  });

  describe("#toggleClearedOnSelectedTiles", () => {
    let tiles: Tile[];
    let grid: Grid;

    beforeEach(() => {
      tiles = createTiles(get5x5TypedLayout(TileType.Regular));
      grid = new Grid(tiles, tileGroups, rules);
    });

    test("can clear selected", () => {
      const selection = new TileSpan(new TilePosition(0, 0), new TilePosition(4, 4));
      grid.applySelection(selection);
      grid.toggleClearedOnSelectedTiles();
      expect(tiles.every(tile => tile.isCleared)).toEqual(true);
    });

    test("can unclear selected", () => {
      const selection = new TileSpan(new TilePosition(0, 0), new TilePosition(4, 4));
      grid.applySelection(selection);
      grid.toggleClearedOnSelectedTiles();
      grid.toggleClearedOnSelectedTiles();
      expect(tiles.every(tile => tile.isCleared)).toEqual(false);
    });
  });

  describe(".isGridCleared", () => {
    let tiles: Tile[];
    let grid: Grid;

    beforeEach(() => {
      tiles = createTiles(get5x5TypedLayout(TileType.Regular));
      grid = new Grid(tiles, tileGroups, rules);
    });

    test("true if all clearable tiles are cleared", () => {
      const selection = new TileSpan(new TilePosition(0, 0), new TilePosition(4, 4));
      grid.applySelection(selection);
      grid.toggleClearedOnSelectedTiles();
      expect(grid.isGridCleared).toEqual(true);
    });

    test("false if not all clearable tiles are cleared", () => {
      expect(grid.isGridCleared).toEqual(false);
    });
  });
});
