import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ConfigService } from "../../../../pricefyfrontlib/app/core/config/config.service";
import { WebConfigInterface } from "../interfaces/monolito/web-config.interface";
import { HttpResponseInterface } from "./../interfaces/http-response.interface";

@Injectable()
export class WebConfigService {
    private readonly uri: string = "configuracoes";

    constructor(private http: HttpClient, private configService: ConfigService) {}

    async loadWebConfig() {
        return this.get().subscribe((httpResponse) => {
            let config: WebConfigInterface = { fileServerAddress: httpResponse.content.fileServerAddress };
            this.set(config);
        });
    }

    get(): Observable<HttpResponseInterface<WebConfigInterface>> {
        return this.http.get<HttpResponseInterface<WebConfigInterface>>(
            `${this.configService.getConfiguration().serviceApiUrl}/${this.uri}`
        );
    }

    set(config: WebConfigInterface) {
        (window as any).webConfig = config;
    }
}
