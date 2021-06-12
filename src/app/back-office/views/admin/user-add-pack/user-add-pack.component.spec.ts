import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddPackComponent } from './user-add-pack.component';

describe('UserAddPackComponent', () => {
  let component: UserAddPackComponent;
  let fixture: ComponentFixture<UserAddPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
