import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { VgApiService } from "@videogular/ngx-videogular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements AfterViewInit {
  @ViewChild("videoElement", { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  vgApi!: VgApiService;
  playlist: string[] = [];
  currentIndex = 0;
  currentVideo = this.playlist[this.currentIndex];

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("en");
  }
  onPlayerReady(api: VgApiService) {
    console.log("player ready", api);
    this.vgApi = api;
    this.vgApi
      .getDefaultMedia()
      .subscriptions.ended.subscribe(() => this.onVideoEnded());
  }
  onVideoEnded() {
    console.log("onVideoEnded", this.currentIndex, this.playlist.length);
    if (this.currentIndex < this.playlist.length - 1) {
      this.playVideo(this.currentIndex + 1);
    }
  }
  playVideo(index: number) {
    this.currentIndex = index;
    this.currentVideo = this.playlist[this.currentIndex];

    // Wait for the video to be ready before playing
    this.videoElement.nativeElement.addEventListener(
      "canplay",
      () => {
        this.vgApi.play();
      },
      { once: true }
    ); // `once: true` ensures the listener is removed after it fires
  }

  async loadVideos() {
    const videos = await window.electronAPI.getVideos();
    this.playlist = videos.map((filePath) => `file://${filePath}`);
  }

  ngAfterViewInit(): void {
    window.electronAPI.onMediaFileSaved(async (filePath: string) => {
      this.playlist.push(`file://${filePath}`);
      this.playVideo(this.playlist.length - 1);
    });
    window.electronAPI.onMediaFileProgress(async (progress) => {
      console.log(progress);
    });
    this.loadVideos();
  }
}
