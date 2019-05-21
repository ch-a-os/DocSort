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

  @Output()
  set onEnter(func: Function) {
    this.onEnterFunction = func;
  }

  get onEnter(): Function { return this.onEnterFunction; }

  onEnterFunction: Function;
  viewIsInitialized: boolean;

  constructor(private api: ApiService) {
    this.viewIsInitialized = false;
  }

  ngAfterViewInit() {
    this.viewIsInitialized = true;
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
  private handleInput(event: KeyboardEvent): void {
    if(event.key == "Enter") {
      if(this.onEnterFunction != undefined) this.onEnterFunction();
    }
  }
}