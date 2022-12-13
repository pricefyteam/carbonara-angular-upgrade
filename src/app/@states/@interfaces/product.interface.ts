import { ProdutoMidiaInterface } from "src/app/@core/interfaces/entities/produto-midia.interface";
import { DepartmentInterface } from "./department.interface";
import { ProductFamilyImageInterface } from "./product-family-image.interface";
import { ProductGtinInterface } from "./product-gtin.interface";
import { ProductMidiaInterface } from "./product.midia.interface";

export interface ProductInterface {
    id?: number;
    gtin: string;
    mainDescription: string;
    secondaryDescription?: string;
    descriptionLabel?: string;
    presentation?: string;
    code?: string;
    images?: ProductFamilyImageInterface[];
    midias?: ProductMidiaInterface[];
    marketingStructure?: DepartmentInterface[];
    productGtins?: ProductGtinInterface[];
    urlThumbnailMain?: string;
    codeProvider?: string;
    type?: string;
    additionalInformation?: any;
    active?: boolean;
}
