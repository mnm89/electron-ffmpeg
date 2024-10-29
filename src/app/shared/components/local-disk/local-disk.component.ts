import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  Tree,
  ChildrenTree,
  VIDEO_EXTENTIONS,
  IMAGE_EXTENTIONS,
} from "../../../helpers";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store/state";
import {
  CURRENT_TREE,
  ADD_TO_LOCAL_PLAY_LIST,
} from "../../../store/Local/reducer";
import { ElectronService } from "../../../core/services";

@Component({
  selector: "app-local-disk",
  templateUrl: "./local-disk.component.html",
  styleUrls: ["./local-disk.component.scss"],
})
export class LocalDiskComponent implements OnInit {
  @ViewChild("folderselection") folderselection!: ElementRef<HTMLDivElement>;
  @ViewChild("playlistselection")
  playlistselection!: ElementRef<HTMLDivElement>;
  @ViewChild("inputSelectFolder")
  inputSelectFolder!: ElementRef<HTMLInputElement>;
  @ViewChild("inputFilterFolder")
  inputFilterFolder!: ElementRef<HTMLInputElement>;
  @ViewChild("inputFilterFile") inputFilterFile!: ElementRef<HTMLInputElement>;
  constructor(
    private serviceElectron: ElectronService,
    private store: Store<AppState>
  ) {
    this.store.select("LOCAL").subscribe((state) => {
      this.localplaylist = state.playlist;
    });
  }

  menuclosed: boolean = false;
  folderList!: Tree;
  fileList: Array<ChildrenTree> = [];
  localplaylist: Array<ChildrenTree> = [];

  onDirChange(event: any) {
    if (event.target.files.length) {
      if (this.serviceElectron.isElectron) {
        var dir: File = event.target.files[0];
        this.store.dispatch({
          type: CURRENT_TREE,
          payload: { name: dir.name, path: dir.path },
        });
      }
    }
    this.inputSelectFolder.nativeElement.value = "";
  }

  readDir(dir: File | ChildrenTree) {
    this.inputFilterFolder.nativeElement.value = "";
    this.inputFilterFile.nativeElement.value = "";
    const fs = this.serviceElectron.fs;
    const path = this.serviceElectron.path;
    this.folderList = {
      name: dir.name,
      path: dir.path,
      childrens: [],
    };
    this.fileList = [];
    try {
      fs.readdirSync(dir.path).forEach((element: any) => {
        try {
          var stats = fs.statSync(path.resolve(dir.path, element));
          var type = stats.isDirectory() ? "D" : stats.isFile() ? "F" : "";
          var date = stats.mtime;
        } catch (error) {
          var type = "D";
          var date = new Date();
        }
        if (type === "D") {
          this.folderList.childrens.push({
            name: element,
            path: path.join(dir.path, element),
            type: type,
            date: date,
          });
        } else if (type === "F") {
          var ext = path.extname(element).replace(".", "");
          if (VIDEO_EXTENTIONS.includes(ext))
            if (
              this.localplaylist.filter(
                (x) => x.path === path.join(dir.path, element)
              ).length === 0
            )
              this.fileList.push({
                name: element,
                path: path.join(dir.path, element),
                type: type,
                date: date,
              });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onSelectItem(item: ChildrenTree) {
    this.store.dispatch({ type: CURRENT_TREE, payload: item });
  }

  addToPlaylist(file: ChildrenTree) {
    this.store.dispatch({ type: ADD_TO_LOCAL_PLAY_LIST, payload: file });
    this.fileList = this.fileList.filter((x) => x.path !== file.path);
  }

  ngOnInit() {
    this.store.select("LOCAL").subscribe((state) => {
      if (state.tree) this.readDir(state.tree);
    });
  }
  toggleFileList() {
    this.inputFilterFolder.nativeElement.value = "";
    this.inputFilterFile.nativeElement.value = "";
    this.folderselection.nativeElement.addEventListener(
      "animationend",
      () => {
        this.folderselection.nativeElement.classList.add("d-none");
        this.playlistselection.nativeElement.classList.remove(
          "d-none",
          "animated",
          "fadeOutLeft"
        );
        this.playlistselection.nativeElement.classList.add(
          "animated",
          "fadeInLeft"
        );
      },
      { once: true, capture: true, passive: true }
    );
    this.folderselection.nativeElement.classList.remove(
      "animated",
      "fadeInLeft"
    );
    this.folderselection.nativeElement.classList.add("animated", "fadeOutLeft");
  }
  toggleFolderList() {
    this.inputFilterFolder.nativeElement.value = "";
    this.inputFilterFile.nativeElement.value = "";
    this.playlistselection.nativeElement.addEventListener(
      "animationend",
      () => {
        this.playlistselection.nativeElement.classList.add("d-none");
        this.folderselection.nativeElement.classList.remove(
          "d-none",
          "animated",
          "fadeOutLeft"
        );
        this.folderselection.nativeElement.classList.add(
          "animated",
          "fadeInLeft"
        );
      },
      { once: true, capture: true, passive: true }
    );
    this.playlistselection.nativeElement.classList.remove(
      "animated",
      "fadeInLeft"
    );
    this.playlistselection.nativeElement.classList.add(
      "animated",
      "fadeOutLeft"
    );
  }
  toggleMenu() {
    this.menuclosed = !this.menuclosed;
  }
}
