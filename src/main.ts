import Interactor from "./application/Interactor";
import UserInterface from "./delivery/UI";
import AnalyticsIml from "./infrastructure/AnalyticsImp";
import NetworkGatewayImp from "./infrastructure/NetworkGatewayImp";

const networkGateway = new NetworkGatewayImp();
const analytics = new AnalyticsIml();
const interactor = new Interactor(networkGateway, analytics);
const userInterface = new UserInterface(interactor);
