import { Component, OnInit } from '@angular/core';
import { ITag, ITagCount } from '../interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-page-show-tags',
  templateUrl: './page-show-tags.component.html',
  styleUrls: ['./page-show-tags.component.css']
})
export class PageShowTagsComponent implements OnInit {

  allTags: Array<ITagCount> = null;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getAllTags();
  }

  async getAllTags() {
    this.allTags = await this.api.getAllTags();

    // mapping random int to all entries as long as the endpoint isn't finished
    this.allTags.map(entry => entry.counts = Math.floor(Math.random() * 100));

    this.allTags.sort((a, b) => {
      return b.counts - a.counts;
    });
  }

}