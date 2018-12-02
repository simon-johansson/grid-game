import { IGridLayout } from "../../domain/boundaries/input";

export const getQueryStringParams = (query: string): any => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query).split("&").reduce((params: any, param) => {
        const [key, value] = param.split("=");
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
        return params;
      }, {})
    : {};
};

// TODO: Skriv tester
export default class QueryStringHandler {
  public level: number | undefined;
  public layout: IGridLayout | undefined;
  public toggleOnOverlap: boolean | undefined;
  public minSelection: number | undefined;
  private queryStringParams: any;

  constructor(query: string) {
    this.queryStringParams = getQueryStringParams(query);

    this.level = this.getParam<number>('level');
    this.layout = this.getParam<IGridLayout>('layout');
    this.toggleOnOverlap = this.getParam<boolean>('toggleOnOverlap');
    this.minSelection = this.getParam<number>('minSelection');
  }

  private getParam<T>(param: string): T | undefined {
    try {
      return JSON.parse(this.queryStringParams[param]) as T;
    } catch (error) {
      return undefined;
    }
  }
}
