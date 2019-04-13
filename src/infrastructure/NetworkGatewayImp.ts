import { IGameLevel, INetworkGateway } from "@application/interfaces";

export default class NetworkGatewayImp implements INetworkGateway {
  public getLevels(): Promise<IGameLevel[]> {
    return this.api<IGameLevel[]>("/levels");
  }

  public getCompletedLevels(): Promise<string[]> {
    return this.api<string[]>("/completedLevels");
  }

  private api<T>(url: string): Promise<T> {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }
}
