import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinToEYHComponent } from './join-to-eyh.component';

describe('JoinToEYHComponent', () => {
  let component: JoinToEYHComponent;
  let fixture: ComponentFixture<JoinToEYHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinToEYHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinToEYHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
