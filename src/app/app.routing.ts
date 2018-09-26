import { Routes } from '@angular/router';
import { LocalDiskComponent } from './components/local-disk/local-disk.component';
import { FtpComponent } from './components/ftp/ftp.component';
import { StreamingComponent } from './components/streaming/streaming.component';
export const routes: Routes = [
    {
        path: '',
        component: LocalDiskComponent,
        pathMatch:'full'
    },
    {
        path:'ftp',
        component:FtpComponent
    },
    {
        path:'streaming',
        component:StreamingComponent
    }

];