import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreHashtagsComponent } from './explore-hashtags.component';

describe('ExploreHashtagsComponent', () => {
  let component: ExploreHashtagsComponent;
  let fixture: ComponentFixture<ExploreHashtagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreHashtagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreHashtagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
