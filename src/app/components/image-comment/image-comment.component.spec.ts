import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCommentComponent } from './image-comment.component';

describe('ImageCommentComponent', () => {
  let component: ImageCommentComponent;
  let fixture: ComponentFixture<ImageCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
