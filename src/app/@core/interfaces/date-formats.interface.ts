import * as moment from "moment";

export interface DateFormatsInterface {
    moment: moment.Moment;
    time?: string;
    date?: string;
    dateTime?: string;
    dateAsTime?: string;
}
