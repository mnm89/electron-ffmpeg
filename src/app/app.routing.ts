import { Routes } from "@angular/router";
import { LocalDiskComponent } from "./shared/components/local-disk/local-disk.component";
import { FtpComponent } from "./shared/components/ftp/ftp.component";
import { StreamingComponent } from "./shared/components/streaming/streaming.component";
export const routes: Routes = [
  {
    path: "",
    component: LocalDiskComponent,
    pathMatch: "full",
  },
  {
    path: "ftp",
    component: FtpComponent,
  },
  {
    path: "streaming",
    component: StreamingComponent,
  },
];
