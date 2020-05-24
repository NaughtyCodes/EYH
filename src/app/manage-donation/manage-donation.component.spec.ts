import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDonationComponent } from './manage-donation.component';

describe('ManageDonationComponent', () => {
  let component: ManageDonationComponent;
  let fixture: ComponentFixture<ManageDonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDonationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
