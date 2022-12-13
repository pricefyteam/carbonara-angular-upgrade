import { DepartamentoInterface } from "./departamento.interface";
import { FamiliaInterface } from "./familia.interface";
import { ProdutoMidiaInterface } from "./produto-midia.interface";
import { ProdutoGtinInterface } from "./produto-gtin.interface";
import { ProdutoImagemInterface } from "./produto-imagem.interface";

export interface ProdutoInterface {
    id: number;
    codigo: string;
    codigoCliente?: string;
    gtin: string;
    monolitoId?: number;
    descricaoPrincipal: string;
    descricaoSecundaria: string;
    descricaoEtiqueta?: string;
    apresentacao?: string;
    departamentoId?: number;
    imagens: ProdutoImagemInterface[];
    midias?: ProdutoMidiaInterface[];
    familias: FamiliaInterface[];
    estruturaMercadologica?: DepartamentoInterface[];
    informacoesAdicionais?: string;
    gtins?: ProdutoGtinInterface[];
    ativo: boolean;
}
