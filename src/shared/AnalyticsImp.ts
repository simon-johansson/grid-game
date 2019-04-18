import { IAnalytics } from "@application/interfaces";
import Level from "@domain/Level";
import * as Sentry from "@sentry/browser";
import { EGAErrorSeverity, EGAProgressionStatus, GameAnalytics } from "gameanalytics";
import LogRocket from "logrocket";
import packageJSON from "../../package.json";
import { isProduction } from "./utils.js";

const GA_KEY = "87aaaa576796f5ef0df26df23fc7c0e3";
const GA_SECRET = "8e789012ed8133df1908eaff64a97d01a1cdcfa4";

const GA_DEV_KEY = "05fa73c552a901b72307566335e61ce0";
const GA_DEV_SECRET = "5383806560f5ec338170b98de5468f387bb31a60";

export default class AnalyticsImp implements IAnalytics {
  constructor() {
    GameAnalytics.configureBuild(packageJSON.version);

    // In production
    if (isProduction()) {
      GameAnalytics.initialize(GA_KEY, GA_SECRET);

      Sentry.init({
        dsn: "https://8af91441ff6842d88135eaa5e82ce9dc@sentry.io/1440646",
        release: packageJSON.version,
      });

      LogRocket.init("rfelo6/gridgame", {
        release: packageJSON.version,
      });

      LogRocket.getSessionURL(sessionURL => {
        Sentry.configureScope(scope => {
          scope.setExtra("sessionURL", sessionURL);
        });
      });
    }
    // In development
    else {
      // GameAnalytics.setEnabledInfoLog(true);
      // GameAnalytics.setEnabledVerboseLog(true);
      GameAnalytics.initialize(GA_DEV_KEY, GA_DEV_SECRET);
    }
  }

  public startLevel(level: Level): void {
    if (level.name !== undefined) {
      GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, level.name.toString());
    }
  }

  public onLevelComplete(level: Level): void {
    GameAnalytics.addProgressionEvent(EGAProgressionStatus.Complete, level.name!.toString());
    if (this.comletedInLessMovesThanExpected(level)) {
      this.onError(`
        Level completed in less moves than expected:
        name: ${level.name}, id: ${level.id}, moves: ${JSON.stringify(level.selections.history)}`);
    }
  }

  public onLevelFailed(level: Level): void {
    GameAnalytics.addProgressionEvent(EGAProgressionStatus.Fail, level.name!.toString());
  }

  public onError(error: Error | string): void {
    GameAnalytics.addErrorEvent(EGAErrorSeverity.Error, error.toString());
    Sentry.captureException(error);
    if (typeof error === "string") {
      LogRocket.captureMessage(error);
    } else {
      LogRocket.captureException(error);
    }
  }

  public onAcceptedInstallPropmpt(): void {
    GameAnalytics.addDesignEvent("InstallPropmpt:Accepted");
  }

  public onRejectedInstallPropmpt(): void {
    GameAnalytics.addDesignEvent("InstallPropmpt:Rejected");
  }

  public onInstall(): void {
    GameAnalytics.addDesignEvent("Installation");
  }

  public onUserEnvironment(isStandalone: boolean): void {
    const InBrowser = isStandalone ? "No" : "Yes";
    GameAnalytics.addDesignEvent(`PlayingInBrowser:${InBrowser}`);
  }

  public onCloseInstallModal(): void {
    GameAnalytics.addDesignEvent(`Modal:Install:Close`);
  }

  private comletedInLessMovesThanExpected(level: Level): boolean {
    return level.selections.left > 0;
  }
}
