import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUploadSingleFileComponent } from './page-upload-single-file.component';

describe('UploadSingleFileComponent', () => {
  let component: PageUploadSingleFileComponent;
  let fixture: ComponentFixture<PageUploadSingleFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageUploadSingleFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageUploadSingleFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
