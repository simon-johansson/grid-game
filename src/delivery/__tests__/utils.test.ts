import { IGridLayout } from "@application/interfaces";
import QueryStringHandler from "../utils/QueryStringHandler";

const setQueryString = (query: string): void => {
  window.history.replaceState({}, "", `?${query}`);
};

describe("QueryStringHandler", () => {
  const levelQs = "level=5";
  const editQs = "edit=true";
  const layout = [
    ["r", "r", "b", "r", "r"],
    ["r", "r", "b", "r", "r"],
    ["r", "r", "b", "r", "r"],
    ["r", "r", "b", "r", "r"],
    ["r", "r", "b", "r", "r"],
  ] as IGridLayout;
  const rules = { toggleOnOverlap: false, minSelection: 4};
  const moves = 3;
  const customLevelQs = `custom=${JSON.stringify({ layout, rules, moves })}`;

  beforeEach(() => {
    setQueryString("");
  });

  test("can get level", () => {
    setQueryString(levelQs);
    const qs = new QueryStringHandler();
    expect(qs.getLevelNumber()).toEqual(5);
  });

  test("level is undefined if not set", () => {
    const qs = new QueryStringHandler();
    expect(qs.getLevelNumber()).toEqual(undefined);
  });

  test("can set level", () => {
    const qs = new QueryStringHandler();
    qs.setLevelNumber(4);
    expect(qs.getLevelNumber()).toEqual(4);
    expect(window.location.search).toEqual("?level=4");
  });

  test("can get custom level", () => {
    setQueryString(customLevelQs);
    const qs = new QueryStringHandler();
    expect(qs.getCustomLevel()).toEqual({ layout, rules, moves });
  });

  test("custom level is undefined if not set", () => {
    const qs = new QueryStringHandler();
    expect(qs.getCustomLevel()).toEqual(undefined);
  });

  test("can set layout", () => {
    const qs = new QueryStringHandler();
    qs.setCustomLevel({ layout, rules, moves });
    expect(decodeURIComponent(window.location.search)).toEqual(`?${customLevelQs}`);
  });

  test("can get edit mode", () => {
    setQueryString(editQs);
    const qs = new QueryStringHandler();
    expect(qs.getIsEditMode()).toEqual(true);
  });

  test("edit is undefined if not set", () => {
    const qs = new QueryStringHandler();
    expect(qs.getIsEditMode()).toEqual(undefined);
  });

  test("can get multiple values", () => {
    setQueryString(`${customLevelQs}&${editQs}`);
    const qs = new QueryStringHandler();
    expect(qs.getCustomLevel()).toEqual({ layout, rules, moves });
    expect(qs.getIsEditMode()).toEqual(true);
  });

  test("can replace value in query string", () => {
    setQueryString(`${customLevelQs}&${editQs}`);
    const qs = new QueryStringHandler();
    qs.setCustomLevel({ layout, rules, moves: 5 });
    qs.setIsEditMode(false);
    expect(qs.getCustomLevel()).toEqual({ layout, rules, moves: 5 });
    expect(qs.getIsEditMode()).toEqual(false);
  });
});
