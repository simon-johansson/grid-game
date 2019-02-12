import { blockerLayout, clearedLayout, defaultLayout } from "../../__tests__/testUtils";
import { IGameLevel, IGameRules, TileType } from "../../boundaries/input";
import Level from "../Level";

const defaultLevel: IGameLevel = {
  layout: defaultLayout
};
const defaultRules: IGameRules = {
  toggleOnOverlap: true,
  minSelection: 1
};

describe("Level", () => {
  test("can create level", () => {
    expect(() => new Level(defaultLevel, 0)).not.toThrow();
  });

  // test("get layout", () => {
  //   const l = new Level(defaultLevel);
  //   expect(l.layout).toEqual(defaultLevel.layout);
  // });

  test("get moves if supplied", () => {
    const l = new Level({ ...defaultLevel, moves: 3 }, 0);
    expect(l.selections.left).toEqual(3);
  });

  test("get undefined if moves are not supplied", () => {
    const l = new Level(defaultLevel, 0);
    expect(l.selections.left).toEqual(undefined);
  });

  test("get rules if supplied", () => {
    const rules = {
      minSelection: 4,
      toggleOnOverlap: false
    };
    const l = new Level({ ...defaultLevel, rules }, 0);
    expect(l.rules).toEqual(rules);
  });

  test("get default rules if rules are not supplied", () => {
    const l = new Level(defaultLevel, 0);
    expect(l.rules).toEqual(defaultRules);
  });

  test("get mix of default and supplied rules", () => {
    const rules = {
      minSelection: 4
    };
    const l = new Level({ ...defaultLevel, rules }, 0);
    expect(l.rules).toEqual({
      minSelection: 4,
      toggleOnOverlap: true
    });
  });

  test.skip("index", () => {});
  test.skip("isLastLevel", () => {});
  test.skip("minified", () => {});
  test.skip("onSelectionMade", () => {});

  // TODO: Flytta tester till utils
  describe(".layout", () => {
    test("translate grid with regular tiles", () => {
      const l = new Level(defaultLevel, 0);
      expect(l.grid.layout).toEqual(
        Array.from({ length: 5 }, () => {
          return Array.from({ length: 5 }, () => TileType.Regular);
        })
      );
    });

    test("translate grid with blocker tiles", () => {
      const l = new Level({ layout: blockerLayout }, 0);
      expect(l.grid.layout).toEqual(
        Array.from({ length: 5 }, () => {
          return Array.from({ length: 5 }, () => TileType.Blocker);
        })
      );
    });

    test("translate grid with cleared tiles", () => {
      const l = new Level({ layout: clearedLayout }, 0);
      expect(l.grid.layout).toEqual(
        Array.from({ length: 5 }, () => {
          return Array.from({ length: 5 }, () => TileType.Cleared);
        })
      );
    });
  });
});
