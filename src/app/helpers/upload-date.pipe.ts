import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment'
import { BehaviorSubject } from 'rxjs';
@Pipe({
  name: 'uploadDate'
})
export class UploadDatePipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(value: string): any {
    const initVal = moment(value).locale(moment.locale(this.translate.currentLang)).calendar();

    const momentObs = new BehaviorSubject<string>(initVal);
    this.translate.onLangChange.subscribe((locale) => {
      const val = moment(value).locale(moment.locale(locale.lang)).calendar();
      momentObs.next(val);
    });
    return momentObs;
  }

}
