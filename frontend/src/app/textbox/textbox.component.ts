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
  @ViewChild('input') textbox: ElementRef<HTMLInputElement>;

  @Input() label: string;
  @Input() width: string;

  elementWidth: string;
  isInitialized: boolean;

  constructor() {
    this.isInitialized = false;
  }

  ngAfterViewInit() {
    this.isInitialized = true;
  }

  getValue() {
    if(this.isInitialized) {
      return this.textbox.nativeElement.value;
    } else {
      console.log("Error: Tried to 'getvalue()' before 'ngAfterViewInit()' was finished.");
    }
  }
}