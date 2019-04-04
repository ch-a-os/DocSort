import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IDocument } from '../interfaces';

@Component({
  selector: 'app-page-history',
  templateUrl: './page-history.component.html',
  styleUrls: ['./page-history.component.css']
})
export class PageHistoryComponent implements OnInit {
  documents: Array<IDocument>;

  constructor(private api: ApiService) {
    this.documents = new Array<IDocument>();
  }

  async ngOnInit() {
    this.documents = await this.api.getLatestDocuments(10);
    this.documents[0].note = "123";
  }

}
