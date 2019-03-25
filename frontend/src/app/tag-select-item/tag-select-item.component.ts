import { Component, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';

@Component({
  selector: 'app-tag-select-item',
  templateUrl: './tag-select-item.component.html',
  styleUrls: ['./tag-select-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TagSelectItemComponent implements OnInit {
  @HostBinding('class.griditem1') griditem1: boolean = false;
  @HostBinding('class.griditem2') griditem2: boolean = false;
  number: number;

  constructor() {

    //let random = Math.floor(Math.random() * (+max - +min)) + +min; 
    let random = Math.floor(Math.random() * (+3 - +1)) +1;
    //this.myClass = "griditem" + random;
    console.log("randomed with " + random);
    if(random == 1) {
      this.griditem1 = true;
    }
    if(random == 2) {
      this.griditem2 = true;
    }
    this.number = random;

    
  }

  ngOnInit() {
  }

}
