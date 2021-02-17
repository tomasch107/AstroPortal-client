import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Params } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SearchService } from '../../../../_services/search.service';

@Component({
  selector: 'app-search-from',
  templateUrl: './search-from.component.html',
  styleUrls: ['./search-from.component.scss']
})
export class SearchFromComponent implements OnInit {
  formGroup: FormGroup;
  formSearch: FormGroup;
  nothingFilledIn = false;
  @Output() search = new EventEmitter<FormGroup>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      title: [null, [Validators.maxLength(50)]],
      description: [null, Validators.maxLength(50)],
      telescope: [null, Validators.maxLength(50)],
      camera: [null, Validators.maxLength(50)],
      mount: [null, Validators.maxLength(50)],
      filters: [null, Validators.maxLength(50)],
      location: [null, Validators.maxLength(50)],
      object: [null, Validators.maxLength(50)],
    }, {validators: this.myFormValidator}
    );
    this.formSearch = this.formBuilder.group({
      text: [null, [Validators.required, Validators.maxLength(50)]],
    }
    );

  }
  myFormValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    const title = group.get('title').value;
    const description = group.get('description').value;
    const telescope = group.get('telescope').value;
    const camera = group.get('camera').value;
    const mount = group.get('mount').value;
    const filters = group.get('filters').value;
    const location = group.get('location').value;
    const object = group.get('object').value;
    let error = false

    if (object === '') {
      return { 'phoneNumberError': true };
    } else {
      return null;
    }
  };

  onSubmit(post) {
    this.search.emit(post);
  }

  isAnyFieldFilledIn(): boolean {
    let oneFilledIn = false;
    Object.keys(this.formGroup.controls).forEach(key => {
      console.log(this.formGroup.controls[key].value)

      if(this.formGroup.controls[key].value != null)
      {
        oneFilledIn = true;

      }
    });
    return oneFilledIn;
  }
}
