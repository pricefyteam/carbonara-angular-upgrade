import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { Observable } from "rxjs";

import { ImageGroupInterface } from "./../@interfaces/image-group.interface";
import { ImageInterface } from "./../@interfaces/image.interface";

@Injectable()
export class ImagesStore extends ComponentStore<{ images: ImageInterface[] }> {
    constructor() {
        super({ images: [] });
    }

    byGtin$(gtin: string): Observable<ImageGroupInterface[]> {
        return this.select((state) => {
            let groups = {};
            const images = state.images.filter((image) => image.productGtin === gtin);
            images.forEach((item) => {
                if (__isNullOrUndefined(groups[item.grouper])) {
                    groups[item.grouper] = [item];
                } else {
                    groups[item.grouper].push(item);
                }
            });

            let imagesGroups: ImageGroupInterface[] = [];

            for (let group of Object.keys(groups)) {
                imagesGroups.push({
                    grouper: parseInt(group),
                    images: groups[group],
                    thumb: groups[group].find((item) => item.thumbnail) || groups[group][0],
                });
            }

            return imagesGroups;
        });
    }

    readonly $images = this.select((state) => {
        let groups = {};

        state.images.forEach((item) => {
            if (__isNullOrUndefined(groups[item.grouper])) {
                groups[item.grouper] = [item];
            } else {
                groups[item.grouper].push(item);
            }
        });

        let imagesGroups: ImageGroupInterface[] = [];

        for (let group of Object.keys(groups)) {
            imagesGroups.push({
                grouper: parseInt(group),
                images: groups[group],
                thumb: groups[group].find((item) => item.thumbnail) || groups[group][0],
            });
        }

        return imagesGroups;
    });

    readonly addImage = this.updater((state, image: ImageInterface) => {
        state.images.push(image);
        return state;
    });
}
