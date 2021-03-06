import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = "";
  password = "";
  loginFailed = false;
  failReason: Array<string> = [];

  constructor(private api: ApiService, private snotifyService: SnotifyService) { }

  ngOnInit() {
    this.api.login("test", "pass");
  }

  async login(username, password) {
    await this.api.login(this.username, this.password);
  }

}
