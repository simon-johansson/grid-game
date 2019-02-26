import { IGameRules, IGridLayout } from "../../application/interfaces";

export interface IQueryStringOptions {
  level?: number;
  layout?: IGridLayout;
  toggleOnOverlap?: boolean;
  minSelection?: number;
  rules: IGameRules;
  edit?: boolean;
  moves?: number;
}

export default class QueryStringHandler implements IQueryStringOptions {
  private queryString: string;
  private params: URLSearchParams;

  constructor() {
    this.queryString = window.location.search;
    this.params = new URLSearchParams(this.queryString);
  }

  public get level(): number | null {
    return this.getParam<number>("level");
  }

  public set level(level: number | null) {
    this.setParam("level", level);
  }

  public get layout(): IGridLayout | null {
    return this.getParam<IGridLayout>("layout");
  }

  public set layout(layout: IGridLayout) {
    this.setParam("layout", JSON.stringify(layout));
  }

  public get toggleOnOverlap(): boolean | null {
    return this.getParam<boolean>("toggleOnOverlap");
  }

  public set toggleOnOverlap(bool: boolean) {
    this.setParam("toggleOnOverlap", bool);
  }

  public get minSelection(): number | null {
    return this.getParam<number>("minSelection");
  }

  public set minSelection(num: number) {
    this.setParam("minSelection", num);
  }

  public get rules(): IGameRules {
    const minSelection = this.minSelection;
    const toggleOnOverlap = this.toggleOnOverlap;
    const rules: IGameRules = Object.assign({},
      minSelection === null ? null : { minSelection },
      toggleOnOverlap === null ? null : { toggleOnOverlap },
    );
    return rules;
  }

  public get moves(): number | null {
    return this.getParam<number>("moves");
  }

  public set moves(num: number) {
    this.setParam("moves", num);
  }

  public get edit(): boolean | null {
    return this.getParam<boolean>("edit");
  }

  public set edit(bool: boolean) {
    this.setParam("edit", bool);
  }

  private getParam<T>(param: string): T | null {
    try {
      return JSON.parse(this.params.get(param));
    } catch (error) {
      // console.log(error);
      return null;
    }
  }

  private setParam(name: string, value?: any) {
    if (value === null) {
      this.params.delete(name);
    } else {
      this.params.set(name, value);
    }
    const pathname = window.location.pathname;
    window.history.pushState({}, "", decodeURIComponent(`${pathname}?${this.params}`));
  }
}
