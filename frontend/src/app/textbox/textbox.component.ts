import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
  host: {
    '[style.width]': 'width'
  }
})
export class TextboxComponent {
  @ViewChild('input')
  textbox: ElementRef<HTMLInputElement>;

  @Input()
  label: string;

  @Input()
  width: string;

  viewIsInitialized: boolean;

  constructor() {
    this.viewIsInitialized = false;
  }

  ngAfterViewInit() {
    this.viewIsInitialized = true;
  }

  getValue() {
    if(this.viewIsInitialized) {
      return this.textbox.nativeElement.value;
    } else {
      console.log("Error: Tried to 'getvalue()' before 'ngAfterViewInit()' was finished.");
      return null;
    }
  }
}