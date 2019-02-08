import MovesCounter from "../MovesCounter";

describe("component/MovesCounter", () => {
  let mc: MovesCounter;

  beforeEach(() => {
    document.body.innerHTML = '<div id="moves-counter"></div>';
    mc = new MovesCounter();
  });

  test("displays correct number of moves level", () => {
    mc.render({
      selectionsLeft: 3,
      selectionsMade: 0,
      isLevelCleared: false
    });
    const content = document.getElementById("moves-counter").textContent;
    expect(content).toContain("3");
    expect(content).toContain("moves left");
  });
});
