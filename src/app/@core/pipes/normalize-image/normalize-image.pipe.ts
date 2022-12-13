import { Pipe, PipeTransform } from "@angular/core";

import { __normalizeImageURL } from "../../helpers/functions";

@Pipe({ name: "normalizeImage" })
export class NormalizeImagePipe implements PipeTransform {
    constructor() {}

    transform(value: any): any {
        return __normalizeImageURL(value);
    }
}
