import { IGameLevel, TileType } from "@application/interfaces";
import LevelManager from "@application/LevelManager";
import Rules from "@domain/Rules";
import {
  blockerLayout,
  clearedLayout,
  createTiles,
  defaultLayout,
  get5x5TypedLayout,
} from "@shared/__tests__/testUtils";

const levelDefaults = {
  rules: new Rules(),
  moves: 3,
};
const levels: IGameLevel[] = [
  { ...levelDefaults, layout: defaultLayout, id: "0" },
  { ...levelDefaults, layout: clearedLayout, id: "1" },
  { ...levelDefaults, layout: blockerLayout, id: "2" },
];

describe("LevelManager", () => {
  test("can not create if init level index is out of bounds", () => {
    expect(() => {
      const level = new LevelManager(levels, -1);
    }).toThrowError();
    expect(() => {
      const level = new LevelManager(levels, 5);
    }).toThrowError();
  });

  describe("#newLevel", () => {
    test("name, isFirst & isLast is not defined if not set", () => {
      const level = LevelManager.newLevel(levels[0]);
      expect(level.name).toEqual(undefined);
      expect(level.isLastLevel).toEqual(undefined);
      expect(level.isLastLevel).toEqual(undefined);
    });

    test("get layout width typed regular tiles", () => {
      const level = LevelManager.newLevel(levels[0]);
      expect(level.grid.layout).toEqual(get5x5TypedLayout(TileType.Regular));
    });

    test("get layout width typed cleared tiles", () => {
      const level = LevelManager.newLevel(levels[1]);
      expect(level.grid.layout).toEqual(get5x5TypedLayout(TileType.Cleared));
    });

    test("get layout width typed blocker tiles", () => {
      const level = LevelManager.newLevel(levels[2]);
      expect(level.grid.layout).toEqual(get5x5TypedLayout(TileType.Blocker));
    });
    test.skip("get layout width typed mixed tiles", () => {});
  });

  describe("#getMinifiedLayout", () => {
    test("get minified layout of regular tiles", () => {
      const tiles = createTiles(get5x5TypedLayout(TileType.Regular));
      expect(LevelManager.getMinifiedLayout(tiles)).toEqual(defaultLayout);
    });
    test("get minified layout of cleared tiles", () => {
      const tiles = createTiles(get5x5TypedLayout(TileType.Cleared));
      expect(LevelManager.getMinifiedLayout(tiles)).toEqual(clearedLayout);
    });
    test("get minified layout of blocker tiles", () => {
      const tiles = createTiles(get5x5TypedLayout(TileType.Blocker));
      expect(LevelManager.getMinifiedLayout(tiles)).toEqual(blockerLayout);
    });
    test.skip("get minified layout of mixed tiles", () => {});
  });

  describe(".getCurrentLevel", () => {
    let levelManager: LevelManager;

    beforeEach(() => {
      levelManager = new LevelManager(levels);
    });

    test("get first level if init level index is not supplied", () => {
      const level = levelManager.getCurrentLevel;
      expect(level.name).toEqual(0);
      expect(level.isFirstLevel).toEqual(true);
      expect(level.isLastLevel).toEqual(false);
    });

    test("get level of init level index if supplied", () => {
      levelManager = new LevelManager(levels, 1);
      const level = levelManager.getCurrentLevel;
      expect(level.name).toEqual(1);
      expect(level.isFirstLevel).toEqual(false);
      expect(level.isLastLevel).toEqual(false);
    });

    test("level should be set as completed if id is present in storage", () => {
      levelManager = new LevelManager(levels, 2, ["2"]);
      const level = levelManager.getCurrentLevel;
      expect(level.hasCompleted).toEqual(true);
    });
  });

  describe(".getNextLevel", () => {
    let levelManager: LevelManager;

    beforeEach(() => {
      levelManager = new LevelManager(levels);
    });

    test("get next level if possible", () => {
      const level = levelManager.getNextLevel;
      expect(level.name).toEqual(1);
    });

    test("can not go past last level", () => {
      levelManager = new LevelManager(levels, 2);
      expect(() => {
        const level = levelManager.getNextLevel;
      }).toThrowError();
    });
  });

  describe(".getPreviousLevel", () => {
    let levelManager: LevelManager;

    beforeEach(() => {
      levelManager = new LevelManager(levels);
    });

    test("get next level if possible", () => {
      levelManager = new LevelManager(levels, 1);
      const level = levelManager.getPreviousLevel;
      expect(level.name).toEqual(0);
    });

    test("can not go past last level", () => {
      expect(() => {
        const level = levelManager.getPreviousLevel;
      }).toThrowError();
    });
  });
});
