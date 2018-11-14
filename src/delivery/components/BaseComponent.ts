
export default abstract class BaseComponent {
  protected abstract wrapperElement: HTMLElement;

  protected bindEvent = (classSelector: string, callback: (e: MouseEvent) => void) => {
    this.wrapperElement.querySelector('.' + classSelector).addEventListener("click", callback);
  }

  protected getEl = (classSelector: string): HTMLElement => {
    return this.wrapperElement.querySelector('.' + classSelector)
  }
}
