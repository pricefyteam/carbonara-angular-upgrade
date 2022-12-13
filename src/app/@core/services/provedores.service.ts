import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ConfigService } from "../../../../pricefyfrontlib/app/core/config/config.service";
import { HttpResponseInterface } from "../interfaces/http-response.interface";
import { ProvedorOutputInterface } from "./../interfaces/models/provedor-output.interface";

@Injectable()
export class ProvedoresService {
    private readonly uri: string = "provedores";

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.uri = `${this.configService.getConfiguration().privateApisUrls.pim}/${this.uri}`;
    }

    obterProvedores(): Observable<HttpResponseInterface<ProvedorOutputInterface[]>> {
        return this.http.get<HttpResponseInterface<ProvedorOutputInterface[]>>(`${this.uri}`);
    }
}
