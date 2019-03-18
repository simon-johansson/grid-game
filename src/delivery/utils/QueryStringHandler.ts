import { IGameLevel } from "@application/interfaces";

export default class QueryStringHandler {
  private queryString: string;
  private params: URLSearchParams;

  constructor() {
    this.queryString = window.location.search;
    this.params = new URLSearchParams(this.queryString);
  }

  public getCustomLevel(): IGameLevel | undefined {
    return this.getParam<IGameLevel>("custom");
  }

  public setCustomLevel(level: IGameLevel): void {
    this.setParam("custom", level);
  }

  public getLevelNumber(): number | undefined {
    return this.getParam<number>("level");
  }

  public setLevelNumber(level: number): void {
    this.setParam("level", level);
  }

  public getIsEditMode(): boolean | undefined {
    return this.getParam<boolean>("edit");
  }

  public setIsEditMode(bool: boolean): void {
    this.setParam("edit", bool);
  }

  private getParam<T>(param: string): T | undefined {
    try {
      const str = this.params.get(param);
      return str !== null ? JSON.parse(str) : undefined;
    } catch (error) {
      console.log(error);

      return undefined;
    }
  }

  private setParam(name: string, value?: any): void {
    if (value === null) {
      this.params.delete(name);
    } else {
      this.params.set(name, JSON.stringify(value));
    }
    const pathname = window.location.pathname;
    window.history.pushState({}, "", decodeURIComponent(`${pathname}?${this.params}`));
  }
}
