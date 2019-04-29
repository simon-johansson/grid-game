import InstallModal, { iosInstructionsClass } from "../InstallModal";
import { bodyClass, buttonClass, overlayClass } from "../Modal";

const onCloseMock = jest.fn();
const onInstallMock = jest.fn();

const el = (className: string): HTMLElement => document.querySelector("." + className) as HTMLElement;

describe("component/InstallModal", () => {
  const emptyComponent = '<div id="modal"></div>';
  let modal: InstallModal;

  beforeEach(() => {
    document.body.innerHTML = emptyComponent;
  });

  afterEach(() => {
    onCloseMock.mockRestore();
    onInstallMock.mockRestore();
    modal.destroy();
  });

  describe("Android", () => {
    beforeEach(() => {
      modal = new InstallModal({
        onClose: onCloseMock,
        onInstall: onInstallMock,
        installViaButton: true,
      });
      modal.render({});
    });

    test("show modal button", () => {
      expect(el(buttonClass)).not.toEqual(null);
    });

    test("not displays safari specific texts", () => {
      expect(el(iosInstructionsClass)).toEqual(null);
    });

    test("install on button click", () => {
      el(buttonClass).click();
      expect(onCloseMock).toBeCalledTimes(1);
      expect(onInstallMock).toBeCalledTimes(1);
      expect(document.body.innerHTML).toEqual(emptyComponent);
    });
  });

  describe("Safari", () => {
    beforeEach(() => {
      modal = new InstallModal({
        onClose: onCloseMock,
        onInstall: onInstallMock,
        installViaButton: false,
      });
      modal.render({});
    });

    test("displays safari specific texts", () => {
      expect(el(iosInstructionsClass)).not.toEqual(null);
      expect(el(bodyClass).textContent).toContain("Press  and then “Add to Home Screen”");
    });

    test("apply additional modal class", () => {
      expect(el(bodyClass).classList.contains("safari-specific")).toEqual(true);
    });

    test("hide modal button", () => {
      expect(el(buttonClass)).toEqual(null);
    });

    test("should not close on overlay click", () => {
      el(overlayClass).click();
      expect(onCloseMock).toBeCalledTimes(0);
      expect(document.body.innerHTML).not.toEqual(emptyComponent);
    });
  });
});
