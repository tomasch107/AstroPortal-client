import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWatchedWatchingListComponent } from './user-watched-watching-list.component';

describe('UserWatchedWatchingListComponent', () => {
  let component: UserWatchedWatchingListComponent;
  let fixture: ComponentFixture<UserWatchedWatchingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWatchedWatchingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWatchedWatchingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
