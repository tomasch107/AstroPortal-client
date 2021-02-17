import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFromComponent } from './search-from.component';

describe('SearchFromComponent', () => {
  let component: SearchFromComponent;
  let fixture: ComponentFixture<SearchFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFromComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
