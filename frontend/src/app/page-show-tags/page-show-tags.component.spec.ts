import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageShowTagsComponent } from './page-show-tags.component';

describe('PageShowTagsComponent', () => {
  let component: PageShowTagsComponent;
  let fixture: ComponentFixture<PageShowTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageShowTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageShowTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
