import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitAdminPackComponent } from './split-admin-pack.component';

describe('SplitAdminPackComponent', () => {
  let component: SplitAdminPackComponent;
  let fixture: ComponentFixture<SplitAdminPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitAdminPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitAdminPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
