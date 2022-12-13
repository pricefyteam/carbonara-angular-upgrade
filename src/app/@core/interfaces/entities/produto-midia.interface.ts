import { ProdutoInterface } from "src/app/@core/interfaces/entities/produto.interface";
export interface ProdutoMidiaInterface {
    id?: number;
    produtoId?: number;
    produto: ProdutoInterface;
    tipo?: number;
    url?: string;
    urlThumbnail?: string;
    principal?: boolean;
    midiaId?: number;
}
