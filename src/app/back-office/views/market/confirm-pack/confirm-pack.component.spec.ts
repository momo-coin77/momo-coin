import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPackComponent } from './confirm-pack.component';

describe('ConfirmPackComponent', () => {
  let component: ConfirmPackComponent;
  let fixture: ComponentFixture<ConfirmPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
