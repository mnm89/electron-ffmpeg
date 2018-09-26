import { NgModule } from '@angular/core';
import {
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatTreeModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSnackBarModule,
    MatCardModule,
} from '@angular/material';

import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
    exports: [
        MatGridListModule,
        MatTreeModule,
        MatIconModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        LayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatSnackBarModule,
        MatCardModule
    ],
})
export class MaterialModule { }
