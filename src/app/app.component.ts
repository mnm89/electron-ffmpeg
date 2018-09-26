import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from './store/state';
import { ChildrenTree } from './helpers';
import { CURRENT_TREE } from './store/Local/reducer';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    private store:Store<AppState>,
    public electronService: ElectronService,
    private translate: TranslateService
  ) {

    this.translate.setDefaultLang('en');
    //console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      //console.log('Mode electron');
      //console.log('Electron ipcRenderer', electronService.ipcRenderer);
      //console.log('NodeJS childProcess', electronService.childProcess);
      //console.log('Electron remote', electronService.remote);
      const app = electronService.remote.app;
      const fs = electronService.fs;
      var ct: ChildrenTree;
      if(localStorage.getItem("LAST_FOLDER"))
       ct=JSON.parse(localStorage.getItem("LAST_FOLDER"))
      else
       ct = {
        name: "home",
        path: app.getPath("home"),
        date: fs.statSync(app.getPath("home")).mtime,
        type: "D"
      }
      this.store.dispatch({type:CURRENT_TREE,payload:ct})
    } else {
      console.log('Mode web');
    }
  }
  currentPath=this.store.select("LOCAL").pipe(
    map(state=>state.tree?state.tree.path:"None")
  )
}
