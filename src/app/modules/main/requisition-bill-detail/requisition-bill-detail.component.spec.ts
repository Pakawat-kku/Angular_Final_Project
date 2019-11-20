import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionBillDetailComponent } from './requisition-bill-detail.component';

describe('RequisitionBillDetailComponent', () => {
  let component: RequisitionBillDetailComponent;
  let fixture: ComponentFixture<RequisitionBillDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionBillDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
