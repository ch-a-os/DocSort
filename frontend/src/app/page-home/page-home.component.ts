import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { IDocument } from '../interfaces';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit {
  title = 'docSort';
  allDocuments: Array<IDocument> = [];
  downloadURL: string;

  constructor(private api: ApiService) {
  }

  async ngOnInit() {
    this.allDocuments = await this.api.getLatestDocuments();
    console.log(this.allDocuments);
  }

  async download(doc) {
    console.log(doc)
    const downloadObject = await this.api.createDownloadObject(doc);
    console.log(downloadObject);
    downloadObject.click();
  }

}