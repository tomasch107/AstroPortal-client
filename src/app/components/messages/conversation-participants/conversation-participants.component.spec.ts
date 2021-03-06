import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationParticipantsComponent } from './conversation-participants.component';

describe('ConversationParticipantsComponent', () => {
  let component: ConversationParticipantsComponent;
  let fixture: ComponentFixture<ConversationParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationParticipantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
