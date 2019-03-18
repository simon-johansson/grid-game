import MovesCounter from "../MovesCounter";

describe("component/MovesCounter", () => {
  let mc: MovesCounter;
  const getTextContent = (): string => document.getElementById("moves-counter")!.textContent!;

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
    expect(getTextContent()).toContain("3");
    expect(getTextContent()).toContain("moves left");
  });

  test("transitions to new number correctly", () => {
    mc.render({
      selectionsLeft: 3,
      selectionsMade: 0,
      isLevelCleared: false
    });
    expect(getTextContent()).toContain("3");
    mc.render({
      selectionsLeft: 2,
      selectionsMade: 0,
      isLevelCleared: false
    });
    expect(getTextContent()).toContain("2");
  });

  test("indicate if level is failed", () => {
    mc.render({
      selectionsLeft: 0,
      selectionsMade: 0,
      isLevelCleared: false
    });
    ;
    expect(mc.counterWrapperElement.className).toContain("failed");
  });

  test("indicate if level is cleared", () => {
    mc.render({
      selectionsLeft: 0,
      selectionsMade: 0,
      isLevelCleared: true
    });
    expect(mc.counterWrapperElement.className).toContain("cleared");
  });
});
