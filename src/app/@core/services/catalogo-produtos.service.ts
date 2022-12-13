import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ConfigService } from "../../../../pricefyfrontlib/app/core/config/config.service";
import { HttpResponseInterface } from "../interfaces/http-response.interface";
import { CatalogoProdutoInterface } from "./../interfaces/entities/catalogo-produto.interface";

@Injectable()
export class CatalogoProdutosService {
    private readonly uri: string = "catalogo-produtos";

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.uri = `${this.configService.getConfiguration().privateApisUrls.pim}/${this.uri}`;
    }

    getProdutoImagens(gtin: string, codeProvider: string): Observable<HttpResponseInterface<CatalogoProdutoInterface>> {
        return this.http.get<HttpResponseInterface<CatalogoProdutoInterface>>(`${this.uri}/${codeProvider}/${gtin}/imagens`);
    }
}
