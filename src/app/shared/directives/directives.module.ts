import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FilePickerDirective } from "./files/file-picker.directive";
import { WebviewDirective } from "./webview/webview.directive";

@NgModule({
  declarations: [FilePickerDirective, WebviewDirective],
  imports: [CommonModule],
  exports: [WebviewDirective, FilePickerDirective],
})
export class DirectivesModule {}
