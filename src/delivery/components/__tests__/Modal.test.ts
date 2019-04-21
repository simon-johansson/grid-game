import Modal, { bodyClass, buttonClass, closeClass, overlayClass, titleClass } from "../Modal";

const onCloseMock = jest.fn();

class TestModal extends Modal {
  protected title = "Title";
  protected bodyText = "Body text";
  protected imageURL = "image.gif";
  protected buttonText = "Button text";
  protected additionalModalClass = "additional-class";
  protected closeOnOverlayClick = true;

  constructor() {
    super(onCloseMock);
  }
}

const el = (className: string): HTMLElement => document.querySelector("." + className) as HTMLElement;

describe("component/Modal", () => {
  const emptyComponent = '<div id="modal"></div>';
  let modal: TestModal;

  beforeEach(() => {
    document.body.innerHTML = emptyComponent;
    modal = new TestModal();
    modal.render({});
  });

  afterEach(() => {
    onCloseMock.mockRestore();
    modal.destroy();
  });

  test("displays correct texts", () => {
    expect(el(titleClass).textContent).toContain("Title");
    expect(el(bodyClass).textContent).toContain("Body text");
    expect(el(buttonClass).textContent).toContain("Button text");
  });

  test("displays image", () => {
    expect(document.body.innerHTML).toContain("<img src=\"image.gif\">");
  });

  test("close modal on cross clicked", () => {
    el(closeClass).click();
    expect(onCloseMock).toBeCalledTimes(1);
    expect(document.body.innerHTML).toEqual(emptyComponent);
  });

  test("close modal on button clicked", () => {
    el(buttonClass).click();
    expect(onCloseMock).toBeCalledTimes(1);
    expect(document.body.innerHTML).toEqual(emptyComponent);
  });

  test("close modal on overlay clicked", () => {
    el(overlayClass).click();
    expect(onCloseMock).toBeCalledTimes(1);
    expect(document.body.innerHTML).toEqual(emptyComponent);
  });

  test("not close modal on modal body clicked", () => {
    el(bodyClass).click();
    expect(onCloseMock).toBeCalledTimes(0);
    expect(document.body.innerHTML).not.toEqual(emptyComponent);
  });
});
