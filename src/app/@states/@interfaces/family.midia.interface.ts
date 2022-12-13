import { ProductInterface } from "src/app/@states/@interfaces/product.interface";
export interface FamilyMidiaInterface {
    id?: number;
    familyId?: number;
    family: { code: string; id: number; monolitoId: number };
    type?: number;
    url?: string;
    urlThumbnail?: string;
    main?: boolean;
    midiaId?: number;
}
