import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";

import { DateFormatsInterface } from "../interfaces/date-formats.interface";

@Injectable()
export class DateFormatsService {
    private momentJsFormatsKey: string = "MOMENT_JS_FORMATS";

    constructor(private translateService: TranslateService) {}

    public formats(date: string): DateFormatsInterface {
        let formats = this.translateService.instant(this.momentJsFormatsKey);
        let formatDate: DateFormatsInterface = { moment: moment(date) };

        for (let key in formats) {
            let attribute: string = this.capitalizeWords(key.split("_").join(" ").toLowerCase()).split(" ").join("");
            formatDate[attribute.charAt(0).toLowerCase() + attribute.substr(1)] = formatDate.moment.format(formats[key]);
        }

        return formatDate;
    }

    private capitalizeWords(words: string) {
        return words.replace(/\w\S*/g, (item) => {
            return item.charAt(0).toUpperCase() + item.substr(1).toLowerCase();
        });
    }
}
