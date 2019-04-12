import Interactor from "./application/Interactor";
import UserInterface from "./delivery/UI";
import AnalyticsIml from "./infrastructure/AnalyticsImp";
import InstallerImp from "./infrastructure/InstallerImp";
import NetworkGatewayImp from "./infrastructure/NetworkGatewayImp";
import QueryStringImp from "./infrastructure/QueryStringImp";
import StorageImp from "./infrastructure/StorageImp";
import { createHelpers } from "./manualTestingHelpers";

const networkGateway = new NetworkGatewayImp();
const analytics = new AnalyticsIml();
const storage = new StorageImp();
const querystring = new QueryStringImp();
const installer = new InstallerImp(analytics);
const interactor = new Interactor(networkGateway, analytics, storage, querystring, installer);
const userInterface = new UserInterface(interactor);

createHelpers(interactor, storage);
