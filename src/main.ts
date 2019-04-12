/* tslint:disable: interface-name */
import Interactor from "./application/Interactor";
import UserInterface from "./delivery/UI";
import InstallerImp from "./infrastructure/InstallerImp";
import NetworkGatewayImp from "./infrastructure/NetworkGatewayImp";
import QueryStringImp from "./infrastructure/QueryStringImp";
import StorageImp from "./infrastructure/StorageImp";
import { createHelpers } from "./manualTestingHelpers";
import AnalyticsImp from "./shared/AnalyticsImp";

declare global {
  interface Window {
    analytics: AnalyticsImp;
  }
}

// Make analytics object global
window.analytics = new AnalyticsImp();

const networkGateway = new NetworkGatewayImp();
const storage = new StorageImp();
const querystring = new QueryStringImp();
const installer = new InstallerImp();
const interactor = new Interactor(networkGateway, window.analytics, storage, querystring, installer);
const userInterface = new UserInterface(interactor);

createHelpers(interactor, storage);
