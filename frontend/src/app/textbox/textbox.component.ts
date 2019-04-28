import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
  host: {
    '[style.width]': 'width'
  }
})
export class TextboxComponent implements OnInit {
  elementWidth: string;

  @Input() label: string;
  @Input() width: string;

  @Output()
  text: EventEmitter<string>;

  constructor() {
    this.text =  new EventEmitter<string>();
  }

  ngOnInit() {
  }

  onChange(event: any) {
    this.text.emit(event.target.value);
    console.log("onChange");
  }

}
