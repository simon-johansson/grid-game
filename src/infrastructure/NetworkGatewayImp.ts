import { IGameLevel } from "../domain/boundaries/input";
import INetworkGateway from "../domain/INetworkGateway";

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
