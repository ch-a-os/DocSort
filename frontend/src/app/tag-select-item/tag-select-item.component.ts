import { Component, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';

@Component({
  selector: 'app-tag-select-item',
  templateUrl: './tag-select-item.component.html',
  styleUrls: ['./tag-select-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagSelectItemComponent implements OnInit {
  @HostBinding('class') state = 'available';
  //@HostBinding('class.selected') selected: boolean = false;
  number: number;

  constructor() {

    //let random = Math.floor(Math.random() * (+max - +min)) + +min; 
    let random = Math.floor(Math.random() * (+50 - +1)) +1;
    //this.myClass = "griditem" + random;
    console.log("randomed with " + random);
    this.number = random;    
  }

  select() {
    this.state = "selected";
    console.log("selected");
  }

  deselect() {
    this.state = "available";
    console.log("deselected");
  }

  ngOnInit() {
  }

}
