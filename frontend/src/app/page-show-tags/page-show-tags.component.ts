import { Component, OnInit } from '@angular/core';
import { ITag } from '../interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-page-show-tags',
  templateUrl: './page-show-tags.component.html',
  styleUrls: ['./page-show-tags.component.css']
})
export class PageShowTagsComponent implements OnInit {

  allTags: Array<ITag> = null;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getAllTags();
  }

  async getAllTags() {
    this.allTags = await this.api.getAllTags();
  }

}
