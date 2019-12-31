import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourContributionComponent } from './your-contribution.component';

describe('YourContributionComponent', () => {
  let component: YourContributionComponent;
  let fixture: ComponentFixture<YourContributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourContributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
