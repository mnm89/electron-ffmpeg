import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private electronService:ElectronService) { }

  ngOnInit() {
  }

  minimise(){
    if(this.electronService.isElectron()){
      this.electronService.ipcRenderer.send("minimize")
    }
  }
  fullscreen(){
    if(this.electronService.isElectron()){
      this.electronService.ipcRenderer.send("fullscreen")
    }
  }
  close(){
    if(this.electronService.isElectron()){
      this.electronService.ipcRenderer.send("close")
    }
  }
}
