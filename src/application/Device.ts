interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default class Device {
  private isStandalone: boolean;
  private installPromptEvent: IBeforeInstallPromptEvent;
  private userAgent = navigator.userAgent || "";
  private isAndroid = /Android/i.test(this.userAgent);
  private isIOS = /iPhone|iPad/i.test(this.userAgent);
  private isSafari = navigator.vendor && /Apple/i.test(this.userAgent);
  private isSafariMobile = !!this.isSafari && !!this.isIOS;

  constructor() {
    this.bindEvents();
    this.checkIfInstalled();
  }

  public get canBeInstalled(): boolean {
    return !this.isStandalone && ((this.isAndroid && this.canShowNativeInstallPrompt) || this.isSafariMobile);
  }

  public get canBeInstalledViaNativeInstallPromp(): boolean {
    return this.isAndroid;
  }

  public get canShowNativeInstallPrompt(): boolean {
    return this.installPromptEvent !== undefined;
  }

  public showNativeInstallPrompt(): void {
    if (this.installPromptEvent !== undefined) {
      this.installPromptEvent.prompt();
      this.installPromptEvent.userChoice.then(result => {
        if (result.outcome === "accepted") {
          alert("accepted");
          // Track event: The web app banner was accepted
        } else {
          alert("not accepted");
          // Track event: The web app banner was dismissed
        }
      });
    }
  }

  private bindEvents(): void {
    window.addEventListener("beforeinstallprompt", (event: IBeforeInstallPromptEvent) => {
      event.preventDefault();
      console.log("beforeinstallprompt");
      this.installPromptEvent = event;
      console.log(this.installPromptEvent);

    });

    window.addEventListener("appinstalled", event => {
      alert("installed");
      // Track event: The app was installed (banner or manual installation)
    });
  }

  private checkIfInstalled(): void {
    this.isStandalone = false;
    if (matchMedia("(display-mode: standalone)").matches) {
      // Android and iOS 11.3+
      this.isStandalone = true;
    } else if ("standalone" in (navigator as any)) {
      // useful for iOS < 11.3
      this.isStandalone = !!(navigator as any).standalone;
    }
    // Track event: The web app is inastalled or not
  }
}
