import Interactor, { IPresenters } from "@application/Interactor";
import { IGameLevel } from "@application/interfaces";
import Rules from "@domain/Rules";
import { ISelectionPresentationData } from "@domain/Selection";
import {
  blockerLayout,
  clearedLayout,
  defaultLayout,
  getAnalyticsMock,
  getNetworkGatewayMock,
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
  { ...levelDefaults, layout: defaultLayout },
  { ...levelDefaults, layout: clearedLayout },
  { ...levelDefaults, layout: blockerLayout },
  { ...levelDefaults, layout: mixedLayout },
];

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
    interactor = new Interactor(getNetworkGatewayMock(levels), getAnalyticsMock(), getStorageMock());
    await interactor.loadLevels();
    done();
  });

  describe("#loadLevels", () => {
    test("throw if try to play without loading levels", () => {
      interactor = new Interactor(getNetworkGatewayMock(levels), getAnalyticsMock(), getStorageMock());
      expect(() => {
        interactor.startCurrentLevel(presenters);
      }).toThrow();
    });

    test("can play start levels after load", () => {
      interactor = new Interactor(getNetworkGatewayMock(levels), getAnalyticsMock(), getStorageMock());
      return interactor.loadLevels().then(() => {
        expect(() => {
          interactor.startCurrentLevel(presenters);
        }).not.toThrow();
      });
    });
  });

  describe("#startCurrentLevel", () => {
    beforeEach(() => {
      tilesHasRendered = false;
    });

    test("start init level", () => {
      const state = interactor.startCurrentLevel(presenters);
      expect(state.name).toEqual(0);
      expect(state.isFirstLevel).toEqual(true);
      expect(tilesHasRendered).toEqual(true);
    });

    test("get current after proceeded to next", () => {
      let state = interactor.startNextLevel(presenters);
      state = interactor.startCurrentLevel(presenters);
      expect(state.name).toEqual(1);
      expect(state.isFirstLevel).toEqual(false);
      expect(tilesHasRendered).toEqual(true);
    });
  });

  describe("#startNextLevel", () => {
    beforeEach(() => {
      tilesHasRendered = false;
    });

    test("start next level from init", () => {
      const state = interactor.startNextLevel(presenters);
      expect(state.name).toEqual(1);
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
      expect(state.name).toEqual(0);
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

  describe("#setSelectionStart", () => {
    beforeEach(() => {
      selectionHasRendered = false;
    });

    test("can set start of selection", () => {
      interactor.startCustomLevel(presenters, levels[0]);
      interactor.setSelectionStart(0, 0);
      const { startTile, endTile } = selectionData.tileSpan;
      expect(selectionHasRendered).toEqual(true);
      expect(startTile.rowIndex).toEqual(0);
      expect(startTile.colIndex).toEqual(0);
      expect(endTile.rowIndex).toEqual(0);
      expect(endTile.colIndex).toEqual(0);
    });
  });

  describe("#setSelectionEnd", () => {
    beforeEach(() => {
      selectionHasRendered = false;
    });

    test("can set start of selection", () => {
      interactor.startCustomLevel(presenters, levels[0]);
      interactor.setSelectionStart(0, 0);
      interactor.setSelectionEnd(100, 100);
      const { startTile, endTile } = selectionData.tileSpan;
      expect(selectionHasRendered).toEqual(true);
      expect(startTile.rowIndex).toEqual(0);
      expect(startTile.colIndex).toEqual(0);
      expect(endTile.rowIndex).toEqual(4);
      expect(endTile.colIndex).toEqual(4);
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
