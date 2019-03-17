import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITag } from '../interfaces';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  @Input() tagData: ITag;
  @Output() toggleSelect = new EventEmitter<ITag>();

  constructor() { }

  ngOnInit() {
  }

  toggleSelected() {
    console.log("child: toggle was called: " + this.tagData.name);
    this.toggleSelect.emit(this.tagData);
  }
}
/*export interface ITag {
  id?: string;
  name: string;
  style: {
    logo: string;
    colorBackground: string;
    colorForeground: string;
  }   
}*/