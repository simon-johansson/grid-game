
export default abstract class Component<Props> {
  protected abstract wrapperElement: HTMLElement;
  protected componentIsOnPage = false;

  public render(props: Props): void {
    if (!this.componentIsOnPage) {
      this.wrapperElement.innerHTML = this.HTML(props);
      this.componentDidMount(props);
      this.componentIsOnPage = true;
    }
    this.update(props);
  }

  protected abstract HTML(props: Props): string;

  protected abstract update(props: Props): void;

  protected componentDidMount(props: Props) {
    return;
  };

  protected bindEvent = (classSelector: string, callback: (e: MouseEvent) => void) => {
    this.wrapperElement.querySelector('.' + classSelector).addEventListener("click", callback);
  }

  protected getEl = (classSelector: string): HTMLElement => {
    return this.wrapperElement.querySelector('.' + classSelector)
  }

  protected getEls = (classSelector: string): NodeList => {
    // TODO: Use getElementsByClassName
    // https://github.com/nefe/You-Dont-Need-jQuery
    return this.wrapperElement.querySelectorAll('.' + classSelector)
  }
}
