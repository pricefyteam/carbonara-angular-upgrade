import * as _ from "lodash";
import * as moment from "moment";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { WebConfigInterface } from "pricefyfrontlib/app/shared/interfaces/pim/web-config.interface";

export function __startDownloadByLink(link: string, name: string) {
    const a = document.createElement("a");
    a.hidden = true;
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.setAttribute("download", name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function __getThumbnailURLFromImages(images: any[] = []) {
    if (images && images.length >= 1) {
        let principal = images.find((image) => image["principal"]);

        if (!__isNullOrUndefined(principal)) {
            return principal["urlThumbnail"] || principal["url"];
        } else if (!__isNullOrUndefined(images)) {
            return images[0]["urlThumbnail"] || images[0]["url"];
        }
    }

    return false;
}

export function __normalizeImageURL(url: string) {
    if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) {
        let webConfig: WebConfigInterface = window["webConfig"];

        if (webConfig.fileServerAddress) {
            return webConfig.fileServerAddress + (url.charAt(0) === "/" ? url.substring(1) : url);
        } else {
            console.warn("Não encontrado valor para `webConfig.fileServerAddress`!");
        }
    }

    return url;
}

export function __mergeObjects(objectOne, objectTwo) {
    return _.assignWith(objectOne, objectTwo, (valueOne, valueTwo) => {
        if (valueOne instanceof moment) {
            return valueTwo;
        }

        if ((_.isObject(valueOne) && !_.isArray(valueOne)) || (_.isArray(valueOne) && _.isObject(valueOne[0]))) {
            return __mergeObjects(valueOne, valueTwo);
        }

        return valueTwo;
    });
}
