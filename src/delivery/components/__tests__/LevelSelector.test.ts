import LevelSelector from "../LevelSelector";

describe("component/LevelSelector", () => {
  let ls: LevelSelector;

  beforeEach(() => {
    document.body.innerHTML = '<div id="level-selection"></div>';
    ls = new LevelSelector(() => {}, () => {}, () => {}, () => {}, () => {});
  });

  test("displays correct level number when playing", () => {
    ls.render({
      currentLevel: 3,
      isLastLevel: false,
      isEditing: false,
      isReviewing: false
    });
    const content = document.getElementById("level-selection").textContent;
    expect(content).toContain("Level 4");
  });

  test("displays correct text if in edit mode", () => {
    ls.render({
      currentLevel: 0,
      isLastLevel: false,
      isEditing: true,
      isReviewing: false
    });
    const content = document.getElementById("level-selection").textContent;
    expect(content).toContain("Level editor");
  });

  test("displays correct text if reviewing custom level", () => {
    ls.render({
      currentLevel: 0,
      isLastLevel: false,
      isEditing: false,
      isReviewing: true
    });
    const content = document.getElementById("level-selection").textContent;
    expect(content).toContain("Review level");
  });
});
