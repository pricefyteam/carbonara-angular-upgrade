import { ProductInterface } from "src/app/@states/@interfaces/product.interface";
export interface ProductMidiaInterface {
    id?: number;
    productId?: number;
    product: { code: string; id: number; monolitoId: number };
    type?: number;
    url?: string;
    urlThumbnail?: string;
    main?: boolean;
    midiaId?: number;
}
