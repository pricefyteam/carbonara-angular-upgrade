import { ProductInterface } from "../../../@states/@interfaces/product.interface";
import { __isNullOrUndefined } from "../../../../../pricefyfrontlib/app/shared/helpers/functions";

export enum ParametroAvancadoChaveEnum {
    INFORMACOES_ADICIONAIS = "EstruturaInformacoesAdicionais",
}

export interface ParametroAvancadoInterface {
    chave: ParametroAvancadoChaveEnum;
    descricao: string;
    tipo: string;
    valor: string;
    edicaoInterna: boolean;
}

export enum InformacaoAdicionalAgrupadorTipoEnum {
    TEXTO = "texto",
    AGRUPADOR = "agrupador",
}

export interface InformacaoAdicionalAgrupadorItem {
    nome: string;
    rotulo: string;
    tipo: InformacaoAdicionalAgrupadorTipoEnum;
}

export interface InformacaoAdicionalAgrupador {
    itens: InformacaoAdicionalAgrupadorItem[];
    nome: string;
    rotulo: string;
    tipo: InformacaoAdicionalAgrupadorTipoEnum;
}

export function getInformacaoAdicionalAgrupadorItemValor(
    product: ProductInterface,
    agrupador: InformacaoAdicionalAgrupador,
    item: InformacaoAdicionalAgrupadorItem
): string {
    if (
        !__isNullOrUndefined(product.additionalInformation) &&
        !__isNullOrUndefined(product.additionalInformation[agrupador.nome]) &&
        !__isNullOrUndefined(product.additionalInformation[agrupador.nome][item.nome])
    ) {
        return product.additionalInformation[agrupador.nome][item.nome];
    } else {
        return "";
    }
}

//quando a estrutura de informacoes adicinais não tiver agrupador/rotulo será por padrão adicionado os nomes abaixo
export const SemAgrupadorNome: string = "SemAgrupador";
export const SemAgrupadorRotulo: string = "Sem Agrupador";
