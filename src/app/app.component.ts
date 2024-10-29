import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements AfterViewInit {
  @ViewChild("videoElement", { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("en");
  }
  ngAfterViewInit(): void {
    const video = this.videoElement.nativeElement;
    // Handle video element errors
    video.addEventListener("error", (e) => {
      console.error("Video element error:", video.error);
    });
    // Receive Blob URL and set as video source
    window.electronAPI.onMediaFileSaved((filePath: string) => {
      video.src = `file://${filePath}`;
      video.play();
    });
  }
  async selectVideo() {
    // Open file dialog and get selected video path
    const filePath = await window.electronAPI.selectVideo();
    if (filePath) {
      console.log("Selected file path:", filePath);
      // Start streaming with the selected video
      window.electronAPI.startStreaming(filePath);
    } else {
      console.log("No file selected");
    }
  }
}
