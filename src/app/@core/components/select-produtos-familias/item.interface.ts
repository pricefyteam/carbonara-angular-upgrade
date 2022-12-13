import { ProdutoInterface } from "src/app/@core/interfaces/entities/produto.interface";

import { FamiliaInterface } from "../../interfaces/entities/familia.interface";
import { SearchTypesEnum } from "./search-types.enum";

export interface ItemInterface {
    labelHeader: string;
    labelCenter: string;
    labelFooter: string;
    thumbnailURL: string | boolean;

    type: SearchTypesEnum;
    primitive: ProdutoInterface | FamiliaInterface;
}
