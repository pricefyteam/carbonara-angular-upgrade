import { TipoMidiaEnum } from "../entities/produto-tipo-midia-enum.interface";

export interface UploadMidiaProdutoInputInterface {
    produtoId?: number;
    produtoCodigo?: string;
    principal?: boolean;
    tipo?: TipoMidiaEnum;
    arquivo?: File;
}
