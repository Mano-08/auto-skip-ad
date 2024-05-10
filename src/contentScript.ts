class AutoSkipAd {
  initiated: Boolean;

  constructor() {
    this.initiated = false;
  }

  private clickSkipButton(adSkipButton: Element) {
    // Create a new click event
    console.log("INSIDE CLICK SKIP AD");
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    // Dispatch the click event on the div element
    adSkipButton.dispatchEvent(clickEvent);
  }

  private sleep(duration: number) {
    return new Promise((resolve) => setTimeout(() => resolve, duration));
  }

  private handleClickMute({ mute }: { mute: Boolean }) {
    console.log("INSIDE HANDLE CLICK MUTE FNX");
    const targetVolumeSlider = document.getElementsByClassName(
      "ytp-volume-slider-handle"
    );

    if (targetVolumeSlider.length === 0) {
      console.log("Volume slider not found");
      return;
    }

    const slider = targetVolumeSlider[0];
    console.log("slider.getAttribute(style) = ", slider.getAttribute("style"));
    if (
      (mute && slider.getAttribute("style") === "left: 0px;") ||
      (!mute && slider.getAttribute("style") !== "left: 0px;")
    ) {
      return;
    } else {
      const targetMuteButton =
        document.getElementsByClassName("ytp-mute-button");
      if (targetMuteButton.length === 0) {
        console.log("Mute button not found");
        return;
      }
      const muteButton = targetMuteButton[0] as HTMLButtonElement;
      muteButton.click();
    }
  }

  private async initiateSkipAd() {
    console.log("INSIDE INITIATE SKIP AD");

    this.handleClickMute({ mute: true });

    const possibleAdClassNames = [
      "ytp-ad-skip-button ytp-button",
      "ytp-ad-skip-button-modern ytp-button",
      "ytp-skip-ad-button",
    ];

    const targetSkipBtn: Element[] = [];
    possibleAdClassNames.forEach((className) => {
      document.getElementsByClassName(className).length !== 0 &&
        targetSkipBtn.push(document.getElementsByClassName(className)[0]);
    });

    if (targetSkipBtn.length === 0) {
      console.log("skip button not found");
      return;
    }
    const adSkipButton = targetSkipBtn[0];
    setTimeout(() => {
      this.clickSkipButton(adSkipButton);
    }, 6000);
  }

  public async main(): Promise<void> {
    console.log("Inside main func");
    while (document.getElementsByClassName("ytp-ad-module").length === 0) {
      await this.sleep(200);
    }
    const target = document.getElementsByClassName("ytp-ad-module");
    if (target.length === 0) {
      console.log("ytp-ad-module not found");
      return;
    }

    const adModule = target[0];
    if (adModule.childElementCount > 0) {
      console.log("AD EXISTS ALREADY");
      this.initiated = true;
      this.initiateSkipAd();
    }

    const callback = (mutationsList: any[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          if (mutation.addedNodes.length > 0 && !this.initiated) {
            this.initiateSkipAd();
            this.initiated = true;
          } else if (mutation.addedNodes.length === 0) {
            this.handleClickMute({ mute: false });
            this.initiated = false;
          }
        }
      }
    };
    7;
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    observer.observe(adModule, config);
  }
}

const obj_ = new AutoSkipAd();
obj_.main();
