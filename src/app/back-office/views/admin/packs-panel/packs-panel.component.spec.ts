import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacksPanelComponent } from './packs-panel.component';

describe('PacksPanelComponent', () => {
  let component: PacksPanelComponent;
  let fixture: ComponentFixture<PacksPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacksPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
