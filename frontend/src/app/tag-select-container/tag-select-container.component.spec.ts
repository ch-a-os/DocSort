import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSelectContainerComponent } from './tag-select-container.component';

describe('TagSelectContainerComponent', () => {
  let component: TagSelectContainerComponent;
  let fixture: ComponentFixture<TagSelectContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagSelectContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSelectContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
