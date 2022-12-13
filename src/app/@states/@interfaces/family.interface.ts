import { FamilyMidiaInterface } from "./family.midia.interface";
import { ProductFamilyImageInterface } from "./product-family-image.interface";
import { ProductInterface } from "./product.interface";

export interface FamilyInterface {
    id?: number;
    code: string;
    mainDescription: string;
    secondaryDescription: string;
    urlThumbnailMain: string;
    images: ProductFamilyImageInterface[];
    midias?: FamilyMidiaInterface[];
    products: ProductInterface[];
}
