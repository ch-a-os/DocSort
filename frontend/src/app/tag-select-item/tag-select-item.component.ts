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

  @Input()
  data: ITag;

  @Output()
  stateToggled = new EventEmitter<ITag>();

  constructor() {}

  toggleState() {
    console.log("toggle was called");
    this.stateToggled.emit(this.data);
  }

  ngOnInit() {
  }

}