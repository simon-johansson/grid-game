import LevelSelector, {
  currentLevelClass,
  editBtnClass,
  nextBtnClass,
  prevBtnClass,
  restartBtnClass,
  reviewBtnClass,
} from "../LevelSelector";

const el = (className: string): HTMLElement => document.querySelector("." + className) as HTMLElement;
const getContent = (): string => document.getElementById("level-selection")!.textContent as string;
const isHidden = (classNames: string[]) => {
  return classNames.every(className => {
    const element = el(className);
    return element.classList.contains("hidden") || element.classList.contains("disabled");
  });
};

describe("component/LevelSelector", () => {
  let ls: LevelSelector;
  let called: string[] = [];
  const callbacks = {
    onPrevLevel: () => called.push("prevLevel"),
    onNextLevel: () => called.push("nextLevel"),
    onRestart: () => called.push("restart"),
    onReviewLevel: () => called.push("reviewLevel"),
    onEditLevel: () => called.push("editLevel"),
    onGoToOverview: () => called.push("goToOverview"),
  };
  const defaultProps = {
    currentLevel: 3,
    isFirstLevel: false,
    isLastLevel: false,
    isEditing: false,
    isReviewing: false,
  };

  beforeEach(() => {
    document.body.innerHTML = '<div id="level-selection"></div>';
    ls = new LevelSelector(callbacks);
  });

  test("displays correct level number when playing", () => {
    ls.render(defaultProps);
    expect(getContent()).toContain("Level 3");
  });

  test("displays correct elements when playing", () => {
    ls.render(defaultProps);
    expect(isHidden([currentLevelClass, nextBtnClass, prevBtnClass, restartBtnClass])).toEqual(false);
    expect(isHidden([reviewBtnClass, editBtnClass])).toEqual(true);
  });

  test("displays correct text if in edit mode", () => {
    ls.render({ ...defaultProps, isEditing: true });
    expect(getContent()).toContain("Level editor");
  });

  test("displays correct elements when in edit mode", () => {
    ls.render({ ...defaultProps, isEditing: true });
    expect(isHidden([currentLevelClass, reviewBtnClass])).toEqual(false);
    expect(isHidden([prevBtnClass, nextBtnClass, restartBtnClass, editBtnClass])).toEqual(true);
  });

  test("displays correct text if reviewing custom level", () => {
    ls.render({ ...defaultProps, isReviewing: true });
    expect(getContent()).toContain("Review level");
  });

  test("displays correct elements when in review mode", () => {
    ls.render({ ...defaultProps, isReviewing: true });
    expect(isHidden([currentLevelClass, restartBtnClass, editBtnClass])).toEqual(false);
    expect(isHidden([prevBtnClass, nextBtnClass, reviewBtnClass])).toEqual(true);
  });

  describe("update", () => {
    test("level name", () => {
      ls.render({ ...defaultProps, currentLevel: 5 });
      expect(getContent()).toContain("Level 5");
      ls.render({ ...defaultProps, currentLevel: 6 });
      expect(getContent()).toContain("Level 6");
    });

    test("can not go before first level", () => {
      ls.render({ ...defaultProps, isFirstLevel: false });
      expect(isHidden([prevBtnClass])).toEqual(false);
      ls.render({ ...defaultProps, isFirstLevel: true });
      expect(isHidden([prevBtnClass])).toEqual(true);
    });

    test("can not go past last level", () => {
      ls.render({ ...defaultProps, isLastLevel: false });
      expect(isHidden([nextBtnClass])).toEqual(false);
      ls.render({ ...defaultProps, isLastLevel: true });
      expect(isHidden([nextBtnClass])).toEqual(true);
    });
  });

  describe("callbacks", () => {
    beforeEach(() => {
      ls.render(defaultProps);
      called = [];
    });

    test("on go to prev level", () => {
      el(prevBtnClass).click();
      expect(called).toContain("prevLevel");
    });

    test("on go to next level", () => {
      el(nextBtnClass).click();
      expect(called).toContain("nextLevel");
    });

    test("on restart level", () => {
      el(restartBtnClass).click();
      expect(called).toContain("restart");
    });

    test("on go to overview", () => {
      el(currentLevelClass).click();
      expect(called).toContain("goToOverview");
    });

    test("on go to review level", () => {
      el(reviewBtnClass).click();
      expect(called).toContain("reviewLevel");
    });

    test("on go to edit level", () => {
      el(editBtnClass).click();
      expect(called).toContain("editLevel");
    });
  });
});
