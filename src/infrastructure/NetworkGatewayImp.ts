import { IGameLevel, INetworkGateway } from "@application/interfaces";

export default class NetworkGatewayImp implements INetworkGateway {
  public getLevels(): Promise<IGameLevel[]> {
    return this.get<IGameLevel[]>("/levels");
  }

  public getCompletedLevels(): Promise<string[]> {
    return this.get<string[]>("/completedLevels");
  }

  public setCompletedLevels(levels: string[]): Promise<Response> {
    return this.post("/completedLevels", levels);
  }

  private get<T>(url: string): Promise<T> {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }

  private post(url: string, body: any): Promise<Response> {
    return fetch(url, { method: "POST", body: JSON.stringify(body) });
  }
}
