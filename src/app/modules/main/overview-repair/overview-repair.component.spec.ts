import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewRepairComponent } from './overview-repair.component';

describe('OverviewRepairComponent', () => {
  let component: OverviewRepairComponent;
  let fixture: ComponentFixture<OverviewRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewRepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
