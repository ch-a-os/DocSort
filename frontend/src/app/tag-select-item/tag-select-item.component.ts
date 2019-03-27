import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostBinding,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { ITagSelectItemStateChange, ITag } from '../interfaces';

@Component({
  selector: 'app-tag-select-item',
  templateUrl: './tag-select-item.component.html',
  styleUrls: ['./tag-select-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagSelectItemComponent implements OnInit {
  
  @HostBinding('class')
  state: string;

  @Input()
  data: ITag;

  @Output()
  tagHasChangedState = new EventEmitter<ITagSelectItemStateChange>();

  constructor() {
    this.state = "available";   
  }

  select() {
    this.state = "selected";
    this.tagHasChangedState.emit({
      state: "selected",
      tagId: this.data._id
    })
  }

  available() {
    this.state = "available";
    this.tagHasChangedState.emit({
      state: "available",
      tagId: this.data._id
    })
  }

  ngOnInit() {
  }

}