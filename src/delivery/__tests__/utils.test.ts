import { getQueryStringParams } from "../utils";

describe("getQueryStringParams", () => {
  const singleParamQS = "?level=5";

  test.skip("pick up query param", () => {
    const param = getQueryStringParams(singleParamQS);
    expect(param).toEqual(true);
  });
});
