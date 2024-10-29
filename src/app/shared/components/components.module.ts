import { NgModule } from "@angular/core";

import { LocalDiskComponent } from "./local-disk/local-disk.component";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { MaterialModule } from "../material/material.module";
import { BrowserModule } from "@angular/platform-browser";
import { TreeViewComponent, TreePipe } from "./tree-view/tree-view.component";
import { FormsModule } from "@angular/forms";
import { FtpComponent } from "./ftp/ftp.component";
import { StreamingComponent } from "./streaming/streaming.component";
import { RouterModule } from "@angular/router";
import { VideoPlayerComponent } from "./video-player/video-player.component";
import { DirectivesModule } from "../directives/directives.module";
import { PipesModule } from "../pipes/pipes.module";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    DirectivesModule,
    PipesModule,
  ],
  declarations: [
    LocalDiskComponent,
    TopBarComponent,
    TreeViewComponent,
    TreePipe,
    FtpComponent,
    StreamingComponent,
    VideoPlayerComponent,
  ],
  exports: [
    LocalDiskComponent,
    TopBarComponent,
    TreeViewComponent,
    TreePipe,
    FtpComponent,
    StreamingComponent,
    VideoPlayerComponent,
  ],
})
export class ComponentsModule {}
