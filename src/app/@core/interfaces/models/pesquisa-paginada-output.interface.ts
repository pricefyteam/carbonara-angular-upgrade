export interface PesquisaPaginadaOutputInterface<T> {
    pagina: number;
    quantidadePaginas: number;
    quantidadeIntensPorPagina: number;
    quantidadeTotalItens: number;
    itens: T[];
}
