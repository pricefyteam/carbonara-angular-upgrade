import { FamiliaImagemInterface } from "./familia-imagem.interface";
import { FamiliaMidiaInterface } from "./familia-midia.interface";
import { ProdutoInterface } from "./produto.interface";

export interface FamiliaInterface {
    id: number;
    codigo: string;
    descricaoPrincipal: string;
    descricaoSecundaria: string;
    monolitoId?: number;
    imagens: FamiliaImagemInterface[];
    midias?: FamiliaMidiaInterface[];
    produtos: ProdutoInterface[];
    familiaVsProdutoId: number;
}
