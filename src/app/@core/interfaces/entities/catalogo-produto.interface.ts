import { CatalogoProdutoImagemInterface } from "./catalogo-produto-imagem.interface";

export interface CatalogoProdutoInterface {
    gtin: string;
    descricao: string;
    provedorId: number;
    imagens: CatalogoProdutoImagemInterface[];
}
