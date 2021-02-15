import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSelectorComponent } from './preview-selector.component';

describe('PreviewSelectorComponent', () => {
  let component: PreviewSelectorComponent;
  let fixture: ComponentFixture<PreviewSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
