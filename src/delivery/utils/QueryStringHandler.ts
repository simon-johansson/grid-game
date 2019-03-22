import { IGameLevel } from "@application/interfaces";

export default class QueryStringHandler {

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
    const params = this.params;

    try {
      const str = params.get(param);
      return str !== null ? JSON.parse(str) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  private setParam(name: string, value?: any): void {
    const params = this.params;

    if (value === null) {
      params.delete(name);
    } else {
      params.set(name, JSON.stringify(value));
    }
    const pathname = window.location.pathname;
    window.history.pushState({}, "", decodeURIComponent(`${pathname}?${params}`));
  }

  private get params(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }
}
