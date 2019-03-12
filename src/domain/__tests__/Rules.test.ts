import Rules, { IGameRules } from "../Rules";

describe("Rules", () => {
  test("get rules if supplied", () => {
    const options = {
      minSelection: 4,
      toggleOnOverlap: false,
    };

    const rules = new Rules(options);
    expect(rules).toEqual(rules);
  });

  test("get default rules if rules are not supplied", () => {
    const defaultRules = {
      toggleOnOverlap: true,
      minSelection: 1
    };

    const rules = new Rules();
    expect(rules).toEqual(defaultRules);
  });

  test("get mix of default and supplied rules", () => {
    const options = {
      minSelection: 4,
    };
    const rules = new Rules(options);
    expect(rules).toEqual({
      minSelection: 4,
      toggleOnOverlap: true,
    });
  });
});
