import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  @Input() tagData: ITagData;
  @Output() toggleSelect = new EventEmitter<ITagData>();

  constructor() { }

  ngOnInit() {
  }

  toggleSelected() {
    console.log("child: toggle was called: " + this.tagData.name);
    this.toggleSelect.emit(this.tagData);
  }

}

interface ITagData {
  id?: number;
  name: string;
  logo: string;
  colorBackground: string;
  colorForeground: string;
}