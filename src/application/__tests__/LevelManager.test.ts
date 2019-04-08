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
  { ...levelDefaults, layout: defaultLayout, id: "id-0" },
  { ...levelDefaults, layout: clearedLayout, id: "id-1" },
  { ...levelDefaults, layout: blockerLayout, id: "id-2" },
];

describe("LevelManager", () => {
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

  describe("#newEditorLevel", () => {
    test("get default editor level if no level is supplied", () => {
      const level = LevelManager.newEditorLevel();
      expect(level.grid.layout).toEqual(get5x5TypedLayout(TileType.Regular));
    });

    test("get custom editor level if level is supplied", () => {
      const level = LevelManager.newEditorLevel(levels[2]);
      expect(level.grid.layout).toEqual(get5x5TypedLayout(TileType.Blocker));
    });
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

  describe(".getCurrentLevel()", () => {
    let levelManager: LevelManager;

    beforeEach(() => {
      levelManager = new LevelManager(levels);
    });

    test("get first level if init level index is not supplied", () => {
      const level = levelManager.getCurrentLevel();
      expect(level.name).toEqual(0);
      expect(level.isFirstLevel).toEqual(true);
      expect(level.isLastLevel).toEqual(false);
    });

    test("get level of init level index if supplied", () => {
      levelManager = new LevelManager(levels, "id-1");
      const level = levelManager.getCurrentLevel();
      expect(level.id).toEqual("id-1");
      expect(level.name).toEqual(1);
      expect(level.isFirstLevel).toEqual(false);
      expect(level.isLastLevel).toEqual(false);
    });

    test("get custom level if supplied", () => {
      const level = levelManager.getCurrentLevel({ ...levelDefaults, layout: blockerLayout });
      expect(level.isCustom).toEqual(true);
      expect(level.grid.layout).toEqual(get5x5TypedLayout(TileType.Blocker));
    });

    test("level should be set as completed if id is present in storage", () => {
      levelManager = new LevelManager(levels, "id-2", ["id-2"]);
      const level = levelManager.getCurrentLevel();
      expect(level.hasCompleted).toEqual(true);
    });
  });

  describe(".nextLevel", () => {
    let levelManager: LevelManager;

    beforeEach(() => {
      levelManager = new LevelManager(levels);
    });

    test("get next level if possible", () => {
      const level = levelManager.nextLevel;
      expect(level.name).toEqual(1);
    });

    test("can not go past last level", () => {
      levelManager = new LevelManager(levels, "id-2");
      expect(() => {
        const level = levelManager.nextLevel;
      }).toThrowError();
    });
  });

  describe(".previousLevel", () => {
    let levelManager: LevelManager;

    beforeEach(() => {
      levelManager = new LevelManager(levels);
    });

    test("get prev level if possible", () => {
      levelManager = new LevelManager(levels, "id-1");
      const level = levelManager.previousLevel;
      expect(level.name).toEqual(0);
    });

    test("can not go below first level", () => {
      expect(() => {
        const level = levelManager.previousLevel;
      }).toThrowError();
    });
  });

  describe(".overview", () => {
    let levelManager: LevelManager;
    const get125Levels = (): IGameLevel[] => {
      const lvls = [];
      for (let i = 0; i < 125; i++) {
        lvls.push({ ...levelDefaults, layout: defaultLayout, id: i.toString() });
      }
      return lvls;
    };
    const getArrayOfNumbers = (low: number, high: number): string[] => {
      const list = [];
      for (let i = low; i <= high; i++) list.push(i.toString());
      return list;
    };

    beforeEach(() => {
      levelManager = new LevelManager(get125Levels(), "35", [...getArrayOfNumbers(0, 25), "33", "55"]);
    });

    test("total number of levels", () => {
      const data = levelManager.overview;
      expect(data.total).toEqual(125);
    });

    test("total number of cleared levels", () => {
      const data = levelManager.overview;
      expect(data.cleared).toEqual(28);
    });

    test("25 levels per stage", () => {
      const data = levelManager.overview;
      expect(data.stages.length).toEqual(5);
      data.stages.forEach(stage => {
        expect(stage.levels.length).toEqual(25);
      });
    });

    test("stage containing currently playing level set as isPlaying", () => {
      const data = levelManager.overview;
      data.stages.forEach((stage, index) => {
        expect(stage.isPlaying).toEqual(index === 1 ? true : false);
      });
    });

    test("stage set as cleared if all containing levels is cleared", () => {
      const data = levelManager.overview;
      data.stages.forEach((stage, index) => {
        expect(stage.isCleared).toEqual(index === 0 ? true : false);
      });
    });
  });
});
