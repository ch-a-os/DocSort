import { Component, Input, ViewChild, ElementRef, Output } from '@angular/core';
import { ApiService } from '../api.service';

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
  focus: any;

  @Input()
  label: string;

  @Input()
  width: string;

  @Input()
  name: string;

  viewIsInitialized: boolean;

  constructor(private api: ApiService) {
    this.viewIsInitialized = false;
  }

  ngAfterViewInit() {
    this.viewIsInitialized = true;
    this.textbox.nativeElement.name = this.name;
    if(this.focus != null) {
      this.textbox.nativeElement.focus();
    }
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