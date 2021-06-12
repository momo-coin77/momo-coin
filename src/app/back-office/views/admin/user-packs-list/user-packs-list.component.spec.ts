import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPacksListComponent } from './user-packs-list.component';

describe('UserPacksListComponent', () => {
  let component: UserPacksListComponent;
  let fixture: ComponentFixture<UserPacksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPacksListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPacksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
