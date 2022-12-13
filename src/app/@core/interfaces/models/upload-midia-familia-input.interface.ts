import { TipoMidiaFamiliaEnum } from "../entities/familia-tipo-midia-enum.interface";

export interface UploadMidiaFamiliaInputInterface {
    familiaId?: number;
    familiaCodigo?: string;
    principal?: boolean;
    tipo?: TipoMidiaFamiliaEnum;
    arquivo?: File;
}
