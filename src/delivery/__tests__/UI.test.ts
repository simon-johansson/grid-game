import Interactor from "@application/Interactor";
import {
  getAnalyticsMock,
  getInstallerMock,
  getNetworkGatewayMock,
  getQuerystringMock,
  getStorageMock,
} from "@shared/__tests__/testUtils";
import UI from "../UI";

describe("UI", () => {
  const isScene = (scene: string): boolean => {
    return document.getElementById("app")!.classList.contains(scene);
  }

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  test("start playable scene if not in edit mode", () => {
    const interactor = new Interactor(
      getNetworkGatewayMock(),
      getAnalyticsMock(),
      getStorageMock(),
      getQuerystringMock({}, { isEditMode: false }),
      getInstallerMock(),
      );
    const ui = new UI(interactor);
    expect(isScene("playable-scene")).toEqual(true);
  });

  test("start editor scene if in edit mode", () => {
    const interactor = new Interactor(
      getNetworkGatewayMock(),
      getAnalyticsMock(),
      getStorageMock(),
      getQuerystringMock({}, { isEditMode: true }),
      getInstallerMock(),
    );
    const ui = new UI(interactor);
    expect(isScene("editor-scene")).toEqual(true);
  });
});
