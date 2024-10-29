import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Tree, ChildrenTree } from "../../../helpers";
import { Pipe, PipeTransform } from "@angular/core";
import { ElectronService } from "../../../core/services";

@Pipe({ name: "treepipe" })
export class TreePipe implements PipeTransform {
  transform(value: Array<ChildrenTree>, term: string): any {
    return value.filter((t) =>
      t.name.toUpperCase().includes(term ? term.toUpperCase() : "")
    );
  }
}

@Component({
  selector: "app-tree-view",
  templateUrl: "./tree-view.component.html",
  styleUrls: ["./tree-view.component.scss"],
})
export class TreeViewComponent {
  @Input("tree") tree!: Tree;
  @Input("term") term!: string;
  @Output() itemClicked: EventEmitter<ChildrenTree> = new EventEmitter();

  onItemClicked(item: ChildrenTree) {
    this.itemClicked.emit(item);
  }
  constructor(private electronSevice: ElectronService) {}

  ngOnInit() {}

  back() {
    if (this.electronSevice.isElectron) {
      const path = this.electronSevice.path;
      this.itemClicked.emit({
        name: path.basename(path.join(this.tree.path, "..")),
        path: path.join(this.tree.path, ".."),
        type: "D",
      });
    }
  }
}
