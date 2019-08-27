import { TileType } from "@application/interfaces";
import TilePosition from "@domain/TilePosition";
import TileSpan from "@domain/TileSpan";
import { get5x5TypedLayout } from "@shared/__tests__/testUtils";
import Level from "../Level";
import Rules from "../Rules";

const defaultMoves = 3;
const defaultRules: Rules = new Rules({
  toggleOnOverlap: true,
  minSelection: 1,
});
const defaultTileGroups: TileSpan[] = [];

describe("Level", () => {
  let level: Level;
  const selectionSpan = new TileSpan(new TilePosition(0, 0), new TilePosition(4, 4));

  beforeEach(() => {
    level = new Level(get5x5TypedLayout(TileType.Regular), defaultMoves, defaultRules, defaultTileGroups, undefined);
  });

  test(".grid", () => {
    expect(level.grid.layout).toEqual(get5x5TypedLayout(TileType.Regular));
    expect(level.grid.numberOfCols).toEqual(5);
    expect(level.grid.numberOfRows).toEqual(5);
  });

  test(".isCustom true if id is not undefined", () => {
    expect(level.isCustom).toEqual(true);
  });

  test(".isCustom false if id is supplied", () => {
    level = new Level(get5x5TypedLayout(TileType.Regular), defaultMoves, defaultRules, defaultTileGroups, "id");
    expect(level.isCustom).toEqual(false);
  });

  describe("#onValidSelection()", () => {
    test("on one valid selection", () => {
      level.onValidSelection(selectionSpan);
      expect(level.selections.made).toEqual(1);
      expect(level.selections.left).toEqual(defaultMoves - 1);
      expect(level.selections.history.length).toEqual(1);
      expect(level.selections.history).toEqual([selectionSpan]);
    });

    test("on multiple valid selection", () => {
      level.onValidSelection(selectionSpan);
      level.onValidSelection(selectionSpan);
      level.onValidSelection(selectionSpan);
      level.onValidSelection(selectionSpan);
      expect(level.selections.made).toEqual(4);
      expect(level.selections.left).toEqual(0);
      expect(level.selections.history.length).toEqual(4);
      expect(level.selections.history).toEqual([selectionSpan, selectionSpan, selectionSpan, selectionSpan]);
    });
  });
});
