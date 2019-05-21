import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { TextboxComponent } from '../textbox/textbox.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

}
