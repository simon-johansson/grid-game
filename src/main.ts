import Interactor from "./application/Interactor";
import UserInterface from "./delivery/UI";
import NetworkGatewayImp from "./infrastructure/NetworkGatewayImp";

const networkGateway = new NetworkGatewayImp();
const interactor = new Interactor(networkGateway);
const userInterface = new UserInterface(interactor);
