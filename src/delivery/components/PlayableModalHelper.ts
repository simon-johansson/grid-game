import { IInstaller, ILevelData, ISettableUserInformation, IUserInformation } from "@application/interfaces";
import sleep from "../utils/sleep";
import HowToPlayModal from "./Modals/HowToPlayModal";
import InstallModal from "./Modals/InstallModal";
import MinSelectionModal from "./Modals/MinSelectionModal";

export default class PlayableModalHelper {
  private InstallModalComponent: InstallModal;
  private HowToPlayModalComponent: HowToPlayModal;
  private MinSelectionModalComponent: MinSelectionModal;

  constructor(
    private installer: IInstaller,
    private setUserData: (userInfo: Partial<ISettableUserInformation>, persisted?: boolean) => void,
  ) {
    this.InstallModalComponent = new InstallModal({
      installViaButton: this.installer.canBeInstalledViaNativeInstallPromp,
      onClose: this.onCloseInstallModal.bind(this),
      onInstall: this.onInstall.bind(this),
    });

    this.HowToPlayModalComponent = new HowToPlayModal();

    this.MinSelectionModalComponent = new MinSelectionModal({
      onClose: this.onCloseMinSelectionModal.bind(this),
    });
  }

  public async checkIfShouldShowModal(level: ILevelData, userInfo: IUserInformation): Promise<void> {
    await sleep(500);
    if (this.shouldShowHowToPlayModal(level)) this.HowToPlayModalComponent.render({});
    else if (this.shouldShowMinSelectionModal(level, userInfo)) this.MinSelectionModalComponent.render({});
    else if (this.shouldShowInstallerModal(userInfo)) this.InstallModalComponent.render({});
  }

  private shouldShowHowToPlayModal({ isFirstLevel, isCleared }: ILevelData): boolean {
    return isFirstLevel !== undefined && isFirstLevel && !isCleared;
  }

  private shouldShowMinSelectionModal(level: ILevelData, userInfo: IUserInformation): boolean {
    return level.rules.minSelection > 1 && !userInfo.hasViewedMinSelectionInfo;
  }

  private shouldShowInstallerModal({ hasViewedInstallationInfo, clearedLevels }: IUserInformation): boolean {
    return this.installer.canBeInstalled && !hasViewedInstallationInfo && clearedLevels >= 15;
  }

  private onCloseMinSelectionModal(): void {
    this.setUserData({ hasViewedMinSelectionInfo: true });
  }

  private onCloseInstallModal(): void {
    const isPersisted = false;
    this.setUserData({ hasViewedInstallationInfo: true }, isPersisted);
    window.analytics.onCloseInstallModal();
  }

  private onInstall(): void {
    this.installer.showNativeInstallPrompt();
  }
}
