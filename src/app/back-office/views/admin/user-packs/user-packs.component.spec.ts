import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPacksComponent } from './user-packs.component';

describe('UserPacksComponent', () => {
  let component: UserPacksComponent;
  let fixture: ComponentFixture<UserPacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
