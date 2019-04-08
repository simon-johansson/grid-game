import Modal from "./Modal";

export default class StayInformedModal extends Modal {
  protected wrapperElement: HTMLElement = document.getElementById("modal") as HTMLElement;
  protected title = "Extra levels";
  protected bodyText = `
    We are working on adding more levels.
    Enter your email if you want to get notified when new levels are released.
  `;
  protected imageURL = "";
  protected buttonText = "Keep me updated";

  constructor(callbacks: { onClose?: () => void; onSubmit: (address: string) => Promise<void> }) {
    super(callbacks.onClose, callbacks.onSubmit);
  }
}
