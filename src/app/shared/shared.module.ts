import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TranslateModule } from "@ngx-translate/core";

import { FormsModule } from "@angular/forms";
import { ComponentsModule } from "./components/components.module";
import { MaterialModule } from "./material/material.module";
import { DirectivesModule } from "./directives/directives.module";
import { PipesModule } from "./pipes/pipes.module";

@NgModule({
  exports: [
    TranslateModule,
    FormsModule,
    ComponentsModule,
    MaterialModule,
    DirectivesModule,
    PipesModule,
  ],
})
export class SharedModule {}
