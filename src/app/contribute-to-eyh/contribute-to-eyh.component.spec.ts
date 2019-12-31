import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributeToEYHComponent } from './contribute-to-eyh.component';

describe('ContributeToEYHComponent', () => {
  let component: ContributeToEYHComponent;
  let fixture: ComponentFixture<ContributeToEYHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributeToEYHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributeToEYHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
