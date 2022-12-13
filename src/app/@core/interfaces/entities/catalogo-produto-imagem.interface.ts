export interface CatalogoProdutoImagemInterface {
    catalogoProdutoId: number;
    url: string;
    sistemaCores: string;
    width?: number;
    height?: number;
    dpi?: number;
    formato: string;
    agrupador: number;
    principal: boolean;
    thumbnail: boolean;
    tags: string;
}
