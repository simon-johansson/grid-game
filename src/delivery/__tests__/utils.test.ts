import { IGameLevel, IGridLayout } from "../../domain/boundaries/input";
import LevelManager from "../utils/LevelManager";
import QueryStringHandler from "../utils/QueryStringHandler";

const setQueryString = (query: string): void => {
  window.history.replaceState({}, "", `?${query}`);
};

describe("QueryStringHandler", () => {
  const levelQs = "level=5";
  const layoutQs =
    'layout=[["r","r","b","r","r"],["r","r","b","r","r"],["r","r","b","r","r"],["r","r","b","r","r"],["r","r","b","r","r"]]';
  const rulesQs = "toggleOnOverlap=false&minSelection=4";
  const editQs = "edit=true";

  beforeEach(() => {
    setQueryString("");
  });

  test("can get level", () => {
    setQueryString(levelQs);
    const qs = new QueryStringHandler();
    expect(qs.level).toEqual(5);
  });

  test("level is null if not set", () => {
    const qs = new QueryStringHandler();
    expect(qs.level).toEqual(null);
  });

  test("can set level", () => {
    const qs = new QueryStringHandler();
    qs.level = 4;
    expect(qs.level).toEqual(4);
    expect(window.location.search).toEqual("?level=4");
  });

  test("can get layout", () => {
    const expected = [
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"]
    ];
    setQueryString(layoutQs);
    const qs = new QueryStringHandler();
    expect(qs.layout).toEqual(expected);
  });

  test("layout is null if not set", () => {
    const qs = new QueryStringHandler();
    expect(qs.layout).toEqual(null);
  });

  test("can set layout", () => {
    const qs = new QueryStringHandler();
    const layout: IGridLayout = [
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"],
      ["r", "r", "b", "r", "r"]
    ];
    qs.layout = layout;
    expect(qs.layout).toEqual(layout);
    expect(decodeURIComponent(window.location.search)).toEqual(`?${layoutQs}`);
  });

  test("can get rules", () => {
    setQueryString(rulesQs);
    const qs = new QueryStringHandler();
    expect(qs.toggleOnOverlap).toEqual(false);
    expect(qs.minSelection).toEqual(4);
  });

  test("rules are null if not set", () => {
    const qs = new QueryStringHandler();
    expect(qs.toggleOnOverlap).toEqual(null);
    expect(qs.minSelection).toEqual(null);
  });

  test("can set rules", () => {
    const qs = new QueryStringHandler();
    qs.toggleOnOverlap = true;
    qs.minSelection = 4;
    expect(qs.toggleOnOverlap).toEqual(true);
    expect(qs.minSelection).toEqual(4);
    expect(window.location.search).toEqual("?toggleOnOverlap=true&minSelection=4");
  });

  test("can get moves", () => {
    setQueryString("moves=3");
    const qs = new QueryStringHandler();
    expect(qs.moves).toEqual(3);
  });

  test("moves are null if not set", () => {
    const qs = new QueryStringHandler();
    expect(qs.moves).toEqual(null);
  });

  test("can set moves", () => {
    const qs = new QueryStringHandler();
    qs.moves = 4;
    expect(qs.moves).toEqual(4);
    expect(window.location.search).toEqual("?moves=4");
  });

  test("can get edit mode", () => {
    setQueryString(editQs);
    const qs = new QueryStringHandler();
    expect(qs.edit).toEqual(true);
  });

  test("edit is null if not set", () => {
    const qs = new QueryStringHandler();
    expect(qs.edit).toEqual(null);
  });

  test("can get multiple values", () => {
    setQueryString(`${levelQs}&${rulesQs}&${editQs}`);
    const qs = new QueryStringHandler();
    expect(qs.level).toEqual(5);
    expect(qs.toggleOnOverlap).toEqual(false);
    expect(qs.minSelection).toEqual(4);
    expect(qs.edit).toEqual(true);
  });

  test("can replace value in query string", () => {
    setQueryString(`${levelQs}&${rulesQs}&${editQs}`);
    const qs = new QueryStringHandler();
    qs.level = 6;
    qs.edit = false;
    expect(qs.level).toEqual(6);
    expect(qs.edit).toEqual(false);
    expect(window.location.search).toEqual("?level=6&toggleOnOverlap=false&minSelection=4&edit=false");
  });

  test("can add value in existing query string", () => {
    setQueryString(`${editQs}`);
    const qs = new QueryStringHandler();
    qs.level = 6;
    expect(qs.level).toEqual(6);
    expect(qs.edit).toEqual(true);
    expect(window.location.search).toEqual("?edit=true&level=6");
  });

  test("can add value in existing query string", () => {
    setQueryString(`${levelQs}&${rulesQs}&${editQs}`);
    const qs = new QueryStringHandler();
    qs.level = null;
    expect(qs.level).toEqual(null);
    expect(window.location.search).toEqual("?toggleOnOverlap=false&minSelection=4&edit=true");
  });
});

describe("LevelManager", () => {
  const defaultRules = {
    toggleOnOverlap: true,
    minSelection: 1
  };
  const levels: IGameLevel[] = [
    {
      moves: 1,
      layout: [
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"]
      ],
      rules: {
        toggleOnOverlap: false,
        minSelection: 1
      }
    },
    {
      moves: 2,
      layout: [
        ["r", "r", "b", "r", "r"],
        ["r", "r", "b", "r", "r"],
        ["r", "r", "b", "r", "r"],
        ["r", "r", "b", "r", "r"],
        ["r", "r", "b", "r", "r"]
      ]
    },
    {
      moves: 3,
      layout: [
        ["b", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "b"]
      ]
    }
  ];

  test("get initial level number", () => {
    const levelManager = new LevelManager(levels, {});
    expect(levelManager.getCurrentLevelNumber).toEqual(0);
  });

  test("get current level", () => {
    const levelManager = new LevelManager(levels, {});
    const expected = {
      ...levels[0]
    };
    expect(levelManager.getCurrentLevel).toEqual(expected);
  });

  test("get current level with custom rules set in query string", () => {
    const levelManager = new LevelManager(levels, {
      toggleOnOverlap: true,
      minSelection: 4
    });
    const expected = {
      ...levels[0],
      rules: {
        toggleOnOverlap: true,
        minSelection: 4
      }
    };
    expect(levelManager.getCurrentLevel).toEqual(expected);
  });

  test("get current level with custom level number set in query string", () => {
    const levelManager = new LevelManager(levels, {
      level: 2
    });
    const expected = {
      ...levels[2],
      rules: defaultRules
    };
    expect(levelManager.getCurrentLevel).toEqual(expected);
  });

  test("get current level with custom layout set in query string", () => {
    const layout: IGridLayout = [
      ["r", "r", "r", "r", "r"],
      ["r", "r", "r", "r", "r"],
      ["f", "r", "r", "r", "f"],
      ["r", "f", "f", "f", "r"],
      ["r", "f", "f", "f", "r"]
    ];
    const levelManager = new LevelManager(levels, { layout });
    const expected: IGameLevel = {
      ...levels[0],
      layout,
      moves: undefined
    };
    expect(levelManager.getCurrentLevel).toEqual(expected);
  });

  describe(".decrementCurrentLevel", () => {
    test("can decrement if not on first level", () => {
      const levelManager = new LevelManager(levels, {
        level: 2
      });
      levelManager.decrementCurrentLevel();
      expect(levelManager.getCurrentLevel.layout).toEqual(levels[1].layout);
    });

    test("can not decrement past first level", () => {
      const levelManager = new LevelManager(levels, {});
      levelManager.decrementCurrentLevel();
      levelManager.decrementCurrentLevel();
      expect(levelManager.getCurrentLevel.layout).toEqual(levels[0].layout);
    });
  });

  describe(".incrementCurrentLevel", () => {
    test("can increment if not on last level", () => {
      const levelManager = new LevelManager(levels, {});
      levelManager.incrementCurrentLevel();
      expect(levelManager.getCurrentLevel.layout).toEqual(levels[1].layout);
    });

    test("can not increment past last level", () => {
      const levelManager = new LevelManager(levels, {});
      levelManager.incrementCurrentLevel();
      levelManager.incrementCurrentLevel();
      levelManager.incrementCurrentLevel();
      levelManager.incrementCurrentLevel();
      expect(levelManager.getCurrentLevel.layout).toEqual(levels[2].layout);
    });
  });

  describe(".canProcedeToNextLevel", () => {
    test("can procede if not on last level and no custom level set", () => {
      const levelManager = new LevelManager(levels, {});
      expect(levelManager.canProcedeToNextLevel).toEqual(true);
    });

    test("can not procede if on last level", () => {
      const levelManager = new LevelManager(levels, {
        level: 2
      });
      expect(levelManager.canProcedeToNextLevel).toEqual(false);
    });

    test("can not procede if custom layout set", () => {
      const levelManager = new LevelManager(levels, {
        layout: levels[2].layout
      });
      expect(levelManager.canProcedeToNextLevel).toEqual(false);
    });
  });
});
