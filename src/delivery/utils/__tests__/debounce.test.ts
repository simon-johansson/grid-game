import debounce from "../debounce";

// tell jest to mock all timeout functions
jest.useFakeTimers();

describe("debounce", () => {
  let func: jest.Mock;
  let debouncedFunc: (...args: any) => void;

  beforeEach(() => {
    func = jest.fn();
    debouncedFunc = debounce(func, 1000);
  });

  test("execute just once", () => {
    for (let i = 0; i < 100; i++) {
      debouncedFunc('something');
    }

    // fast-forward time
    jest.runAllTimers();

    expect(func).toBeCalledTimes(1);
    expect(func).toBeCalledWith('something');
  });
});
