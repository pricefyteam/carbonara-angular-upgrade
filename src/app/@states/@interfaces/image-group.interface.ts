import { ImageInterface } from "./image.interface";

export interface ImageGroupInterface {
    grouper: number;
    images: ImageInterface[];
    thumb: ImageInterface;
}
