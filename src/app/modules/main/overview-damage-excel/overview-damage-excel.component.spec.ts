import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewDamageExcelComponent } from './overview-damage-excel.component';

describe('OverviewDamageExcelComponent', () => {
  let component: OverviewDamageExcelComponent;
  let fixture: ComponentFixture<OverviewDamageExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewDamageExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewDamageExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
