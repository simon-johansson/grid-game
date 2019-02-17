import { IGameLevel } from "../application/boundaries/input";
import INetworkGateway from "../application/INetworkGateway";

export default class NetworkGatewayImp implements INetworkGateway {
  public getLevels(): Promise<IGameLevel[]> {
    return this.api<IGameLevel[]>("/levels");
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
