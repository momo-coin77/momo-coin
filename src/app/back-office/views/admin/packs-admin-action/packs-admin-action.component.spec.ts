import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacksAdminActionComponent } from './packs-admin-action.component';

describe('PacksAdminActionComponent', () => {
  let component: PacksAdminActionComponent;
  let fixture: ComponentFixture<PacksAdminActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacksAdminActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacksAdminActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
