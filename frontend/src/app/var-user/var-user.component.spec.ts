import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarUserComponent } from './var-user.component';

describe('VarUserComponent', () => {
  let component: VarUserComponent;
  let fixture: ComponentFixture<VarUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
