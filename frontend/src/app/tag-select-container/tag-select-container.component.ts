import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { ITag, ITagSelectItemStateChange } from '../interfaces';

@Component({
  selector: 'app-tag-select-container',
  templateUrl: './tag-select-container.component.html',
  styleUrls: ['./tag-select-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagSelectContainerComponent implements OnInit {

  tagsAvailable: Array<ITag>;
  tagsSelected: Array<ITag>;

  @Output()
  tagsToSend: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  constructor(private api: ApiService) {
    this.tagsAvailable = new Array<ITag>();
    this.tagsSelected = new Array<ITag>();
  }

  async ngOnInit(): Promise<void> {
    this.tagsAvailable = await this.api.getTags();
  }

  sortTags(array: Array<ITag>) {
    array.sort((a, b) => {
      if(a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        return -1;
      }
      if(a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        return 1;
      }
      return 0;
    });
  }

  stateToggled(tag: ITag) {
    console.log("parent called: " + tag.name);
    let foundEntryIndex = this.tagsSelected.indexOf(tag);

    // This pushes a tag to the selected ones If it isn't already in there.
    // If it's in selected tags, it get moved into available tags.
    if(foundEntryIndex == -1) {
      console.log("tag " + tag.name + " not found, pushing");
      this.tagsSelected.push(tag);
      let found = this.tagsAvailable.indexOf(tag);
      this.tagsAvailable.splice(found, 1);
    } else {
      console.log("tag " + tag.name + " found, removing");
      this.tagsAvailable.push(tag);
      this.tagsSelected.splice(foundEntryIndex, 1);

    }
    let newIdList = new Array<string>();
    for (const entry of this.tagsSelected) {
      newIdList.push(entry._id);
    }
    this.tagsToSend.emit(newIdList);
    console.log("emitted:", newIdList);

    // sorting both lists alphabetical
    this.sortTags(this.tagsAvailable);
    this.sortTags(this.tagsSelected);
  }
}