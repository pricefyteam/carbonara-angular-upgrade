import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { ConfigService } from "../../../../pricefyfrontlib/app/core/config/config.service";
import { ProdutoOuFamiliaOutputInterface } from "../interfaces/entities/produto-ou-familia-output.interface";
import { HttpResponseInterface } from "../interfaces/http-response.interface";
import { IndexarProdutoOuFamiliaInterface } from "../interfaces/models/indexar-produto-ou-familia.interface";
import { AutocompleteOutputInterface } from "./../interfaces/models/autocomplete-output.interface";

@Injectable()
export class BuscaTextualService {
    private readonly uri: string = "busca-textual";

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.uri = `${this.configService.getConfiguration().privateApisUrls.pim}/${this.uri}`;
    }

    getItens(
        texto: string,
        pagina: number = 1,
        quantidadeItensPorPagina: number = environment.maxRegister,
        tipo?: string,
        somenteComThumbnail: boolean = true
    ): Observable<HttpResponseInterface<AutocompleteOutputInterface<ProdutoOuFamiliaOutputInterface>>> {
        let params = new HttpParams();

        if (tipo) {
            params = params.set("tipo", tipo);
        }

        params = params.set("texto", texto);
        params = params.set("pagina", pagina.toString());
        params = params.set("quantidadeItensPorPagina", quantidadeItensPorPagina.toString());
        params = params.set("somenteComThumbnail", somenteComThumbnail.toString());

        return this.http.get<HttpResponseInterface<AutocompleteOutputInterface<ProdutoOuFamiliaOutputInterface>>>(
            `${this.uri}/autocompletar`,
            {
                params: params,
            }
        );
    }

    indexItem(codigo: string, tipo: string): Observable<HttpResponseInterface<IndexarProdutoOuFamiliaInterface>> {
        return this.http.post<HttpResponseInterface<IndexarProdutoOuFamiliaInterface>>(`${this.uri}/${tipo}s/codigo:${codigo}/index`, {});
    }
}
