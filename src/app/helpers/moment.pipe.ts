import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment'
import { BehaviorSubject } from 'rxjs';
@Pipe({
  name: 'commentDate'
})
export class MomentPipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(value: string): any {
    const initVal = moment(value).locale(moment.locale(this.translate.currentLang)).fromNow();

    const momentObs = new BehaviorSubject<string>(initVal);
    this.translate.onLangChange.subscribe((locale) => {
      const val = moment(value).locale(moment.locale(locale.lang)).fromNow();
      momentObs.next(val);
    });
    return momentObs;
  }
}
