import { IGameLevel, IGameRules, IGridLayout, IQueryString } from "@application/interfaces";

export default class QueryStringImp implements IQueryString {
  public getLevel(): IGameLevel | undefined {
    const layout = this.getLayout();
    const rules = this.getRules();
    const moves = this.getMoves();
    if (layout !== undefined && rules !== undefined && moves !== undefined) {
      return { layout, rules, moves };
    }
    return undefined;
  }

  public getLayout(): IGridLayout | undefined {
    return this.getParam<IGridLayout>("layout");
  }

  public setLayout(layout: IGridLayout): void {
    this.setParam("layout", layout);
  }

  public getRules(): IGameRules | undefined {
    return this.getParam<IGameRules>("rules");
  }

  public setRules(rules: IGameRules): void {
    this.setParam("rules", rules);
  }

  public getMoves(): number | undefined {
    return this.getParam<number>("moves");
  }

  public setMoves(moves: number): void {
    this.setParam("moves", moves);
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
