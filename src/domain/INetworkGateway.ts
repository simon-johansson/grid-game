import { IGameLevel } from "./boundaries/input";

export default interface INetworkGateway {
  getLevels: () => Promise<IGameLevel[]>
}
