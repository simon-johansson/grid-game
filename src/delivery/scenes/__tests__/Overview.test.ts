import Interactor from "@application/Interactor";
import {
  getAnalyticsMock,
  getDefaultGameLevels,
  getInstallerMock,
  getNetworkGatewayMock,
  getQuerystringMock,
  getStorageMock,
} from "@shared/__tests__/testUtils";
import { RouterPaths } from "src/delivery/UI";
import Overview from "../Overview";

const el = (className: string): HTMLElement => document.querySelector("." + className) as HTMLElement;
const getContent = (): string => document.getElementById("overview")!.textContent as string;

describe("component/LevelSelector", () => {
  // let overview: Overview;
  const interactor = new Interactor(
    getNetworkGatewayMock(getDefaultGameLevels(50)),
    getAnalyticsMock(),
    getStorageMock(),
    getQuerystringMock(),
    getInstallerMock(),
  );
  const router = (path: RouterPaths): void => {};

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    return interactor.loadLevels().then(() => {
      Overview.setScene(interactor, router);
    });
  });

  test.only("start on current level", () => {
    console.log(document.body.innerHTML);
  });

  test.only("go to stage", () => {});

  test.only("go to locked stage", () => {});

  test.only("go to level", () => {});
});
