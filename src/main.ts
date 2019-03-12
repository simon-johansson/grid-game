import Interactor from "./application/Interactor";
import UserInterface from "./delivery/UI";
import AnalyticsIml from "./infrastructure/AnalyticsImp";
import NetworkGatewayImp from "./infrastructure/NetworkGatewayImp";
import StorageImp from "./infrastructure/StorageImp";

const networkGateway = new NetworkGatewayImp();
const analytics = new AnalyticsIml();
const storage = new StorageImp();
const interactor = new Interactor(networkGateway, analytics, storage);
const userInterface = new UserInterface(interactor);
