import Interactor, { IPresenters } from "@application/Interactor";
import { IGameLevel } from "@application/interfaces";
import Rules from "@domain/Rules";
import { ISelectionPresentationData } from "@domain/Selection";
import { TileType } from "@domain/Tile";
import {
  blockerLayout,
  clearedLayout,
  defaultLayout,
  getAnalyticsMock,
  getInstallerMock,
  getNetworkGatewayMock,
  getQuerystringMock,
  getSelectionPresenter,
  getStorageMock,
  getTilePresenter,
  mixedLayout,
} from "@shared/__tests__/testUtils";

let presenters: IPresenters;
const levelDefaults = {
  rules: new Rules(),
  moves: 3,
};
const levels: IGameLevel[] = [
  { ...levelDefaults, layout: defaultLayout, id: "id-0" },
  { ...levelDefaults, layout: clearedLayout, id: "id-1" },
  { ...levelDefaults, layout: blockerLayout, id: "id-2" },
  { ...levelDefaults, layout: mixedLayout, id: "id-3" },
];
let querystringLevel: any = {};
let selectionHasRendered: boolean;
let selectionData: ISelectionPresentationData;
let tilesHasRendered: boolean;
presenters = {
  selection: getSelectionPresenter(data => {
    selectionData = data;
    selectionHasRendered = true;
  }),
  tile: getTilePresenter(() => {
    tilesHasRendered = true;
  }),
};

describe("Interactor", () => {
  let interactor: Interactor;

  beforeEach(async done => {
    interactor = new Interactor(
      getNetworkGatewayMock(levels),
      getAnalyticsMock(),
      getStorageMock(),
      getQuerystringMock(querystringLevel),
      getInstallerMock(),
    );
    await interactor.loadLevels();
    done();
  });

  describe("#loadLevels", () => {
    test("throw if try to play without loading levels", () => {
      interactor = new Interactor(
        getNetworkGatewayMock(levels),
        getAnalyticsMock(),
        getStorageMock(),
        getQuerystringMock(),
        getInstallerMock(),
      );
      expect(() => {
        interactor.startCurrentLevel(presenters);
      }).toThrow();
    });

    test("can play levels after load", () => {
      interactor = new Interactor(
        getNetworkGatewayMock(levels),
        getAnalyticsMock(),
        getStorageMock(),
        getQuerystringMock(),
        getInstallerMock(),
      );
      return interactor.loadLevels().then(() => {
        expect(() => {
          interactor.startCurrentLevel(presenters);
        }).not.toThrow();
      });
    });

    test("cache levels on initial load", async () => {
      let networkRequests = 0;
      interactor = new Interactor(
        getNetworkGatewayMock(levels, [], "", () => {
          networkRequests++;
        }),
        getAnalyticsMock(),
        getStorageMock(),
        getQuerystringMock(),
        getInstallerMock(),
      );
      await interactor.loadLevels();
      expect(networkRequests).toEqual(1);
      await interactor.loadLevels();
      expect(networkRequests).toEqual(1);
    });

    test("get current level from cache", async () => {
      interactor = new Interactor(
        getNetworkGatewayMock(levels, [], "id-2"),
        getAnalyticsMock(),
        getStorageMock(),
        getQuerystringMock(),
        getInstallerMock(),
      );
      await interactor.loadLevels();
      const level = interactor.startCurrentLevel(presenters);
      expect(level.id).toEqual("id-2");
    });

    test("get completed levels from cache", async () => {
      interactor = new Interactor(
        getNetworkGatewayMock(levels, ["id-0", "id-2", "id-3"]),
        getAnalyticsMock(),
        getStorageMock(),
        getQuerystringMock(),
        getInstallerMock(),
      );
      await interactor.loadLevels();
      const { cleared } = interactor.getOverviewData();
      expect(cleared).toEqual(3);
    });

    test("sync cache and local storage", async () => {
      const storage = getStorageMock();
      const currentLevel = "id-1";
      const completedLevels = ["id-0", "id-2", "id-3"];
      interactor = new Interactor(
        getNetworkGatewayMock(levels, completedLevels, currentLevel),
        getAnalyticsMock(),
        storage,
        getQuerystringMock(),
        getInstallerMock(),
      );
      await interactor.loadLevels();
      expect(await storage.getCompletedLevels()).toEqual(completedLevels);
      expect(await storage.getCurrentLevel()).toEqual(currentLevel);
    });
  });

  describe("#startCurrentLevel", () => {
    beforeEach(() => {
      tilesHasRendered = false;
    });

    test("start init level", () => {
      const state = interactor.startCurrentLevel(presenters);
      expect(state.name).toEqual(1);
      expect(state.isFirstLevel).toEqual(true);
      expect(tilesHasRendered).toEqual(true);
    });

    test("get current after proceeded to next", () => {
      let state = interactor.startNextLevel(presenters);
      state = interactor.startCurrentLevel(presenters);
      expect(state.name).toEqual(2);
      expect(state.isFirstLevel).toEqual(false);
      expect(tilesHasRendered).toEqual(true);
    });

    test.skip("start level from query string", () => {});
  });

  describe("#startSpecificLevel", () => {
    beforeEach(() => {
      tilesHasRendered = false;
    });

    test("start specific level", () => {
      const state = interactor.startSpecificLevel(presenters, "id-2");
      expect(state.name).toEqual(3);
    });

    test.skip("id supplied does not match any level", () => {});
  });

  describe("#startNextLevel", () => {
    beforeEach(() => {
      tilesHasRendered = false;
    });

    test("start next level from init", () => {
      const state = interactor.startNextLevel(presenters);
      expect(state.name).toEqual(2);
      expect(state.isFirstLevel).toEqual(false);
      expect(tilesHasRendered).toEqual(true);
    });

    test.skip("can not go past last level", () => {});
  });

  describe("#startPrevLevel", () => {
    beforeEach(() => {
      tilesHasRendered = false;
    });

    test("start prev level after proceeded to next", () => {
      let state = interactor.startNextLevel(presenters);
      state = interactor.startPrevLevel(presenters);
      expect(state.name).toEqual(1);
      expect(state.isFirstLevel).toEqual(true);
      expect(tilesHasRendered).toEqual(true);
    });

    test.skip("can not go below first level", () => {});
  });

  describe("#startCustomLevel", () => {
    beforeEach(() => {
      tilesHasRendered = false;
    });

    test("can start custom level", () => {
      const state = interactor.startCustomLevel(presenters, levels[0]);
      expect(state.name).toEqual(undefined);
      expect(tilesHasRendered).toEqual(true);
    });
  });

  describe("#startEditorLevel", () => {
    beforeEach(() => {
      tilesHasRendered = false;
    });

    afterEach(() => {
      querystringLevel = {};
    });

    test("can start empty editor level", () => {
      const state = interactor.startEditorLevel(presenters);
      expect(state.isCustom).toEqual(true);
      expect(tilesHasRendered).toEqual(true);
    });

    test("level is represented in querystring", () => {
      interactor.startEditorLevel(presenters);
      expect(querystringLevel.moves).toEqual(1);
      expect(querystringLevel.rules).not.toEqual(undefined);
      expect(querystringLevel.layout).not.toEqual(undefined);
    });
  });

  describe("#setSelectionStart", () => {
    beforeEach(() => {
      selectionHasRendered = false;
    });

    test("can set start of selection", () => {
      interactor.startCustomLevel(presenters, levels[0]);
      interactor.setSelectionStart(0, 0);
      const { startTile, endTile } = selectionData.tileSpan!;
      expect(selectionHasRendered).toEqual(true);
      expect(startTile.rowIndex).toEqual(0);
      expect(startTile.colIndex).toEqual(0);
      expect(endTile.rowIndex).toEqual(0);
      expect(endTile.colIndex).toEqual(0);
    });

    test("can set start of selection with edit tile", () => {
      interactor.startEditorLevel(presenters);
      interactor.setSelectionStart(0, 0, TileType.Blocker);
      const expected = [
        ["b", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
        ["r", "r", "r", "r", "r"],
      ];
      expect(querystringLevel.layout).toEqual(expected);
      expect(interactor.getGridLayout()).toEqual(expected);
    });
  });

  describe("#setSelectionEnd", () => {
    beforeEach(() => {
      selectionHasRendered = false;
    });

    test("can set end of selection", () => {
      interactor.startCustomLevel(presenters, levels[0]);
      interactor.setSelectionStart(0, 0);
      interactor.setSelectionEnd(100, 100);
      const { startTile, endTile } = selectionData.tileSpan!;
      expect(selectionHasRendered).toEqual(true);
      expect(startTile.rowIndex).toEqual(0);
      expect(startTile.colIndex).toEqual(0);
      expect(endTile.rowIndex).toEqual(4);
      expect(endTile.colIndex).toEqual(4);
    });

    test("can set end of selection with edit tile", () => {
      interactor.startEditorLevel(presenters);
      interactor.setSelectionStart(0, 0, TileType.Cleared);
      interactor.setSelectionEnd(100, 100, TileType.Cleared);
      const expected = [
        ["f", "f", "f", "f", "f"],
        ["f", "f", "f", "f", "f"],
        ["f", "f", "f", "f", "f"],
        ["f", "f", "f", "f", "f"],
        ["f", "f", "f", "f", "f"],
      ];
      expect(querystringLevel.layout).toEqual(expected);
      expect(interactor.getGridLayout()).toEqual(expected);
    });
  });

  describe("#processSelection", () => {
    test("clear tiles if not blocker is selected", () => {
      interactor.startCustomLevel(presenters, levels[0]);
      interactor.setSelectionStart(0, 0);
      interactor.setSelectionEnd(100, 100);
      const state = interactor.processSelection();

      expect(state.isCleared).toEqual(true);
      expect(interactor.getGridLayout()).toEqual(clearedLayout);
    });

    test("do not clear tiles if blocker is selected ", () => {
      interactor.startCustomLevel(presenters, levels[2]);
      interactor.setSelectionStart(0, 0);
      interactor.setSelectionEnd(100, 100);
      const state = interactor.processSelection();

      expect(state.isCleared).toEqual(false);
      expect(interactor.getGridLayout()).toEqual(blockerLayout);
    });

    test("remove selection after process", () => {
      interactor.startCustomLevel(presenters, levels[2]);
      interactor.setSelectionStart(0, 0);
      interactor.setSelectionEnd(50, 50);
      interactor.processSelection();

      expect(selectionData.tileSpan).toEqual(undefined);
    });
  });

  describe.skip("#removeSelection", () => {});

  describe("#getGridLayout", () => {
    test("get minified layout", () => {
      interactor.startCustomLevel(presenters, levels[3]);
      expect(interactor.getGridLayout()).toEqual(mixedLayout);
    });

    test("get minified layout after processed selection", () => {
      interactor.startCustomLevel(presenters, levels[1]);
      interactor.setSelectionStart(0, 0);
      interactor.setSelectionEnd(50, 50);
      interactor.processSelection();

      const expected = [
        ["r", "r", "r", "f", "f"],
        ["r", "r", "r", "f", "f"],
        ["r", "r", "r", "f", "f"],
        ["f", "f", "f", "f", "f"],
        ["f", "f", "f", "f", "f"],
      ];
      expect(interactor.getGridLayout()).toEqual(expected);
    });
  });
});
