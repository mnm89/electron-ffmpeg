import { Component, ViewChild } from "@angular/core";
import { VIDEO_EXTENSIONS } from "../../../helpers";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store/state";
import { ADD_TO_PLAY_LIST, PLAY } from "../../../store/play-list/reducer";
import { FilePickerDirective } from "../../directives/files/file-picker.directive";

@Component({
  selector: "app-local-disk",
  templateUrl: "./local-disk.component.html",
  styleUrls: ["./local-disk.component.scss"],
})
export class LocalDiskComponent {
  @ViewChild("buttonPicker", { static: true })
  buttonPicker!: FilePickerDirective;
  menuOpened: boolean = true;
  playlist: Array<File> = [];
  current: File | null = null;

  constructor(private store: Store<AppState>) {
    this.store.select("PlayList").subscribe((state) => {
      this.playlist = state.playlist;
      this.current = state.current;
    });
  }

  onFilesChanged(files: FileList) {
    const videos = Array.from(files).filter((f) => {
      if (!f.type.startsWith("video/")) return false;
      const name_arr = f.name.split(".");
      const ext = name_arr[name_arr.length - 1];
      if (!VIDEO_EXTENSIONS.includes(ext)) return false;
      return true;
    });
    if (videos.length) {
      videos.forEach((f) =>
        this.store.dispatch({ type: ADD_TO_PLAY_LIST, payload: f })
      );
    }
  }

  onSelectFile(item: File) {
    this.store.dispatch({ type: PLAY, payload: item });
  }

  toggleMenu() {
    this.menuOpened = !this.menuOpened;
  }
}
