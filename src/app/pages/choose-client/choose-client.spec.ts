import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseClient } from './choose-client';

describe('ChooseClient', () => {
  let component: ChooseClient;
  let fixture: ComponentFixture<ChooseClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
