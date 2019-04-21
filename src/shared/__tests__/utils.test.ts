import { isProduction } from "../utils";

describe("utils", () => {
  describe("isProduction", () => {
    beforeAll(() => {
      const location = JSON.stringify(window.location);
      delete window.location;

      Object.defineProperty(window, "location", {
        value: JSON.parse(location),
      });

      Object.defineProperty(window.location, "hostname", {
        value: "google.com",
        configurable: true,
      });
    });

    test("return false if not prod env", () => {
      window.location.hostname = "grid-game-dev.herokuapp.com";
      expect(isProduction()).toEqual(false);
    });

    test("return true if prod env", () => {
      window.location.hostname = "gridgame.net";
      expect(isProduction()).toEqual(true);
    });
  });
});
