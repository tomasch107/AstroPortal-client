import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeConversationNameComponent } from './change-conversation-name.component';

describe('ChangeConversationNameComponent', () => {
  let component: ChangeConversationNameComponent;
  let fixture: ComponentFixture<ChangeConversationNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeConversationNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeConversationNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
