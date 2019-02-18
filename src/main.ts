import GameInteractor from "./application/GameInteractor";
import UserInterface from "./delivery/UserInterface";
import NetworkGatewayImp from "./infrastructure/NetworkGatewayImp";

const networkGateway = new NetworkGatewayImp();
const gameInteractor = new GameInteractor(networkGateway);
const userInterface = new UserInterface(gameInteractor);
