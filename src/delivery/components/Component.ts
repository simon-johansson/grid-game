export default abstract class Component<Props> {
  protected abstract wrapperElement: HTMLElement;
  protected componentIsOnPage = false;
  private prevProps: Props;

  public render(props: Props): void {
    if (!this.componentIsOnPage) {
      this.wrapperElement.innerHTML = this.HTML(props);
      this.componentDidMount(props);
      this.componentIsOnPage = true;
    }
    if (this.hasPropsChanged(props)) {
      this.prevProps = props;
      this.update(props);
    }
  }

  protected abstract HTML(props: Props): string;

  protected abstract update(props: Props): void;

  protected componentDidMount(props: Props): any {
    return;
  }

  protected bindClickEvent = (classSelector: string, callback: (e: MouseEvent) => void) => {
    const el = this.wrapperElement.querySelector("." + classSelector);
    if (el) el.addEventListener("click", callback);
    else console.error('Can not bind click event to .' + classSelector)
  };

  protected bindChangeEvent = (classSelector: string, callback: (e: MouseEvent) => void) => {
    const el = this.wrapperElement.querySelector("." + classSelector);
    if (el) el.addEventListener("change", callback);
    else console.error('Can not bind change event to .' + classSelector)
  };

  protected getEl = (classSelector: string): HTMLElement | null => {
    return this.wrapperElement.querySelector("." + classSelector);
  };

  protected getEls = (classSelector: string): NodeList => {
    // TODO: Use getElementsByClassName
    // https://github.com/nefe/You-Dont-Need-jQuery
    return this.wrapperElement.querySelectorAll("." + classSelector);
  };

  /**
   * Simplistic way of comparing two objects.
   * Does not work for function but those will (mostly) be added on
   * component creation and not supplied to .render()
   */
  private hasPropsChanged(newProps: Props): boolean {
    return JSON.stringify(this.prevProps) !== JSON.stringify(newProps);
  }
}
