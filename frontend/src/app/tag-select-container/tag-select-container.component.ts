import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import { ITag, ITagSelectItemStateChange } from '../interfaces';

@Component({
  selector: 'app-tag-select-container',
  templateUrl: './tag-select-container.component.html',
  styleUrls: ['./tag-select-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagSelectContainerComponent implements OnInit {

  tagList: Array<ITag>;
  selectedTagIds: Array<string>;

  constructor(private api: ApiService) {
    this.tagList = new Array<ITag>();
    this.selectedTagIds = new Array<string>();
  }

  async ngOnInit(): Promise<void> {
    this.tagList = await this.api.getTags();
  }

  tagHasChangedState(stateChange: ITagSelectItemStateChange): void {
    let foundEntryIndex = this.selectedTagIds.indexOf(stateChange.tagId);
    if(stateChange.state == "selected") {
      if(foundEntryIndex == -1) {
        // tagId isn't existing yet, will push
        this.selectedTagIds.push(stateChange.tagId);
      }
    } else if(stateChange.state == "available") {
      if(foundEntryIndex != -1) {
        // tagId does exist, will delete
        this.selectedTagIds.splice(foundEntryIndex, 1);
      }
    }
  }
}