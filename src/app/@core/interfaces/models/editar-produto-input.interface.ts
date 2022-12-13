export interface EditarProdutoInputInterface {
    id: number;
    descricaoPrincipal: string;
    descricaoSecundaria: string;
    descricaoEtiqueta: string;
    apresentacao: string;
    ativo: boolean;
    informacoesAdicionais?: string;
}
