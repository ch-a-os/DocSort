import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tag-select',
  templateUrl: './tag-select.component.html',
  styleUrls: ['./tag-select.component.css']
})
export class TagSelectComponent implements OnInit {
  @Output() tagsToSend = new EventEmitter<Array<Tag|number>>();

  tagsAvailable: Array<Tag>;
  tagsSelected: Array<Tag>;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {
    this.tagsAvailable = new Array<Tag>();
    this.tagsSelected = new Array<Tag>();
  }

  async ngOnInit() {
    let temp = await this.api.getTags();
    for(let entry of temp) {
      this.tagsAvailable.push(entry);
    }
    //this.tagsSelected = await this.api.getTags();
    console.log("loaded " + this.tagsAvailable.length + " tags");
  }

  toggleSelect(tag: Tag) {
    console.log("parent called: " + tag.name);
    let foundEntryIndex = this.tagsSelected.indexOf(tag);
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
    this.tagsToSend.emit(this.tagsSelected);
    //this.tagsSelected = [].concat(this.tagsSelected);
    
    //let temp = Object.assign([],this.selectedTags);
    //this.selectedTags = temp;
    //this.cdr.detectChanges();
    //console.log("length=" + this.tagsAvailable.length + " / " + this.tagsSelected.length);
  }

  /*selectTag(tag: TagComponent) {
    let foundEntry = this.selectedTags.indexOf(tag);
    if(foundEntry == -1) {
      this.selectedTags.push(tag);
    }
  }

  deselectTag(tag: TagComponent) {
    let foundEntryIndex = this.selectedTags.indexOf(tag);
    if(foundEntryIndex != -1) {
      this.selectedTags.splice(foundEntryIndex, 1);
    }
  }*/

}

class Tag {
  id?: number;
  name: string;
  logo: string;
  colorBackground: string;
  colorForeground: string;
}