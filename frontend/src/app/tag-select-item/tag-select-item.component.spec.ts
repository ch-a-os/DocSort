import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSelectItemComponent } from './tag-select-item.component';

describe('TagSelectItemComponent', () => {
  let component: TagSelectItemComponent;
  let fixture: ComponentFixture<TagSelectItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagSelectItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSelectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
