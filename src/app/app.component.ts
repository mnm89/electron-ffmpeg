import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Store } from "@ngrx/store";
import { AppState } from "./store/state";
import { map } from "rxjs/operators";
import { ElectronService } from "./core/services";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(
    private store: Store<AppState>,
    public electronService: ElectronService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang("en");
    if (electronService.isElectron) {
      /*  const fs = electronService.fs;
      var ct: ChildrenTree;
      if(localStorage.getItem("LAST_FOLDER"))
       ct=JSON.parse(localStorage.getItem("LAST_FOLDER")!)
      else
       ct = {
        name: "home",
        path: app.getPath("home"),
        date: fs.statSync(app.getPath("home")).mtime,
        type: "D"
      }
      this.store.dispatch({type:CURRENT_TREE,payload:ct}) */
    } else {
      console.log("Mode web");
    }
  }
  currentPath = this.store
    .select("LOCAL")
    .pipe(map((state) => (state.tree ? state.tree.path : "None")));
}
