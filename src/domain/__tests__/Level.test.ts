import { get5x5TypedLayout } from "@shared/__tests__/testUtils";
import { TileType } from "../../application/interfaces";
import Level from "../Level";
import Rules from "../Rules";

const defaultMoves = 3;
const defaultRules: Rules = new Rules({
  toggleOnOverlap: true,
  minSelection: 1,
});

describe("Level", () => {
  let level: Level;

  beforeEach(() => {
    level = new Level(get5x5TypedLayout(TileType.Regular), defaultMoves, defaultRules);
  })

  test(".grid", () => {
    expect(level.grid.layout).toEqual(get5x5TypedLayout(TileType.Regular));
    expect(level.grid.numberOfCols).toEqual(5);
    expect(level.grid.numberOfRows).toEqual(5);
  });

  describe("#onValidSelection()", () => {
    test("on one valid selection", () => {
      level.onValidSelection();
      expect(level.selections.made).toEqual(1);
      expect(level.selections.left).toEqual(defaultMoves - 1);
    });

    test("on multiple valid selection", () => {
      level.onValidSelection();
      level.onValidSelection();
      level.onValidSelection();
      level.onValidSelection();
      expect(level.selections.made).toEqual(4);
      expect(level.selections.left).toEqual(0);
    });
  });
});
