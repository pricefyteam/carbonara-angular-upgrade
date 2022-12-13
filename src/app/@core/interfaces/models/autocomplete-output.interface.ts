import { AutocompleteItemInterface } from "./autocomplete-item.interface";

export interface AutocompleteOutputInterface<T> {
    pagina: number;
    maximoRegistros: number;
    itens: AutocompleteItemInterface<T>[];
}
