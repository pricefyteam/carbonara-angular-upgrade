import { ProdutoInterface } from "./../../../../../pricefyfrontlib/app/shared/interfaces/pim/produto.interface";

export interface PesquisarProdutoOutput {
    dados: ProdutoInterface;
    destaque: JSON;
}
