import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  NgZone,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store/state";
import { ChildrenTree } from "../../../helpers";
import { REMOVE_FROM_LOCAL_PLAY_LIST } from "../../../store/Local/reducer";
import { ElectronService } from "../../../core/services";

@Component({
  selector: "app-video-player",
  templateUrl: "./video-player.component.html",
  styleUrls: ["./video-player.component.scss"],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild("player") player!: ElementRef<HTMLMediaElement>;
  @ViewChild("audioplayer") audioplayer!: ElementRef<HTMLMediaElement>;
  @ViewChild("container") playerContainer!: ElementRef<HTMLDivElement>;

  playList: Array<ChildrenTree> = [];
  current: ChildrenTree = {
    path: "",
    name: "",
    type: "",
  };

  playing: boolean = false;
  playlist_toggled: boolean = false;

  media_duration!: number;
  processing!: number;
  played_time!: number;
  volume!: number;

  command: any;
  commandAudio: any;
  ffprobData: any;
  constructor(
    private store: Store<AppState>,
    private electronService: ElectronService,
    private zone: NgZone
  ) {
    this.store.select("LOCAL").subscribe((state) => {
      this.playlist_toggled = state.toggle_playlist;
      this.playList = state.playlist;
    });
  }

  ngOnDestroy(): void {
    if (this.command) this.command.kill();
    if (this.hasAudiotrack()) this.commandAudio.kill();
  }

  ngOnInit() {
    this.player.nativeElement.volume = 0.5;
    this.volume = this.player.nativeElement.volume * 100;
  }

  onCommandProgresse(progress: any) {
    this.processing = progress.percent;
    console.log("onCommandProgresse ====>", progress);
  }
  onCommandError(err: any) {
    console.log("An error occurred: " + err.message);
  }
  onCommandeEnd(mediaSource: MediaSource) {
    mediaSource.endOfStream();
    this.processing = 100;
    console.log("Processing finished !");
  }
  onCommandeData(sourceBuffer: SourceBuffer, chunk: ArrayBufferLike) {
    sourceBuffer.appendBuffer(new Uint8Array(chunk));
    if (!this.playing) this.play();
  }

  onMediaSourceOpen(mediaSource: MediaSource, path: string) {
    var ffmpeg = this.electronService.ffmpeg;
    var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    sourceBuffer.mode = "sequence";
    this.command = ffmpeg(path, {})
      .format("webm")
      .videoCodec("libvpx")
      //.videoBitrate(ffprobdata.format.bit_rate, true)
      //.withFpsOutput(30)
      //.audioCodec('libvorbis')
      .noAudio()
      .on("progress", this.onCommandProgresse.bind(this))
      .on("error", this.onCommandError.bind(this))
      .on("end", this.onCommandeEnd.bind(this, mediaSource));
    var ffstream = this.command.pipe();
    ffstream.on("data", this.onCommandeData.bind(this, sourceBuffer));
  }
  onAudioMediaSourceOpen(mediaSource: MediaSource, path: string) {
    var ffmpeg = this.electronService.ffmpeg;
    var sourceBuffer = mediaSource.addSourceBuffer(
      'video/webm; codecs="vorbis"'
    );
    sourceBuffer.mode = "sequence";
    this.commandAudio = ffmpeg(path, {})
      .format("webm")
      //.videoCodec('libvpx')
      //.videoBitrate(ffprobdata.format.bit_rate, true)
      //.withFpsOutput(30)
      .audioCodec("libvorbis")
      .noVideo()
      .on("progress", function (progress: any) {
        console.log("onAudioCommandProgresse ====>", progress);
      })
      .on("error", function (err: any) {
        console.log("An error occurred: " + err.message);
      })
      .on("end", function () {
        mediaSource.endOfStream();
        console.log("Processing finished !");
      });
    var ffstream = this.commandAudio.pipe();
    ffstream.on("data", function (chunk: ArrayBufferLike) {
      sourceBuffer.appendBuffer(new Uint8Array(chunk));
    });
  }
  prepareAudioMediaSource(path: string) {
    var mediaSource = new MediaSource();
    this.audioplayer.nativeElement.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener(
      "sourceopen",
      this.onAudioMediaSourceOpen.bind(this, mediaSource, path)
    );
  }

  async prepareMediaSource(path: string) {
    this.ffprobData = await this.electronService.ffprobe(path);
    if (this.hasAudiotrack()) this.prepareAudioMediaSource(path);
    console.log(this.ffprobData);
    this.media_duration = this.ffprobData.format.duration;
    var mediaSource = new MediaSource();
    this.player.nativeElement.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener(
      "sourceopen",
      this.onMediaSourceOpen.bind(this, mediaSource, path)
    );
  }

  switchCurrent(item: ChildrenTree) {
    this.current = item;
    if (this.command) this.command.kill();
    if (this.hasAudiotrack()) this.commandAudio.kill();
    this.stop();
    this.prepareMediaSource(this.current.path);
  }
  removeFromPlayList(item: ChildrenTree) {
    this.store.dispatch({ type: REMOVE_FROM_LOCAL_PLAY_LIST, payload: item });
  }
  hasAudiotrack(): boolean {
    if (this.ffprobData)
      return (
        this.ffprobData.streams.filter((x: any) => x.codec_type === "audio")
          .length > 0
      );
    return false;
  }
  hasNext() {}
  hasPrevious() {}

  //// controls actions
  play() {
    this.player.nativeElement.play();
    if (this.hasAudiotrack()) this.audioplayer.nativeElement.play();
  }
  pause() {
    this.player.nativeElement.pause();
    if (this.hasAudiotrack()) this.audioplayer.nativeElement.pause();
  }
  stop() {
    this.player.nativeElement.pause();
    this.player.nativeElement.currentTime = 0;
    if (this.hasAudiotrack()) {
      this.audioplayer.nativeElement.pause();
      this.audioplayer.nativeElement.currentTime = 0;
    }
  }
  soundDown() {
    this.volume -= 10;
    this.audioplayer.nativeElement.volume = this.volume / 100;
  }
  soundUp() {
    this.volume += 10;
    this.audioplayer.nativeElement.volume = this.volume / 100;
  }
  toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.playerContainer.nativeElement.requestFullscreen();
    }
  }
  togglePlaylist() {
    this.playlist_toggled = !this.playlist_toggled;
  }

  //// video events
  onPlay(event: any) {
    this.playing = true;
  }
  onPause(even: any) {
    this.playing = false;
  }
  onTimeUpdate(event: any) {
    var processed_time = (this.processing * this.media_duration) / 100;
    var current_time = this.player.nativeElement.currentTime;
    this.played_time = (current_time / this.media_duration) * 100;
    if (this.hasAudiotrack()) {
      this.audioplayer.nativeElement.currentTime = current_time;
    }
  }
  onError(event: any) {
    console.log(event);
  }
  onEnded(event: any) {
    var index = this.playList.findIndex((x) => x.path === this.current.path);
    if (index + 1 < this.playList.length)
      setTimeout(() => {
        this.switchCurrent(this.playList[index + 1]);
      }, 20);
    console.log(index, this.playList.length);
  }
}
