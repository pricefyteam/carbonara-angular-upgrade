import { FamiliaInterface } from "./familia.interface";

export interface FamiliaMidiaInterface {
    id?: number;
    familiaId?: number;
    familia: FamiliaInterface;
    tipo?: number;
    url?: string;
    urlThumbnail?: string;
    principal?: boolean;
    midiaId?: number;
}
