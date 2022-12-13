import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "pricefyfrontlib/app/core/auth/auth.service";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { Observable, of } from "rxjs";
import { ConfigService } from "../../../../pricefyfrontlib/app/core/config/config.service";
import { HttpResponseCodes, HttpResponseInterface } from "../interfaces/http-response.interface";
import { map } from "rxjs/operators";
import {
    InformacaoAdicionalAgrupador,
    InformacaoAdicionalAgrupadorTipoEnum,
    ParametroAvancadoChaveEnum,
    ParametroAvancadoInterface,
    SemAgrupadorNome,
    SemAgrupadorRotulo,
} from "../interfaces/entities/parametro-avancado.interface";

@Injectable()
export class ClientesService {
    private readonly uri: string = "clientes";
    private static estruturaInformacoesAdicionais: HttpResponseInterface<ParametroAvancadoInterface> = undefined;

    constructor(private http: HttpClient, private configService: ConfigService, private authService: AuthService) {
        this.uri = `${this.configService.getConfiguration().privateApisUrls.pim}/${this.uri}`;
    }

    private getEstruturaInformacoesAdicionais(): Observable<HttpResponseInterface<ParametroAvancadoInterface>> {
        if (!__isNullOrUndefined(ClientesService.estruturaInformacoesAdicionais)) {
            return of(ClientesService.estruturaInformacoesAdicionais);
        }

        const codigoCliente: string = this.authService.User.cliente.codigo;
        let params = new HttpParams();

        return this.http
            .get<HttpResponseInterface<ParametroAvancadoInterface>>(
                `${this.uri}/codigo:${codigoCliente}/parametros-avancados/${ParametroAvancadoChaveEnum.INFORMACOES_ADICIONAIS}`,
                { params: params }
            )
            .pipe(
                map((httpResponse) => {
                    ClientesService.estruturaInformacoesAdicionais = httpResponse;
                    return httpResponse;
                })
            );
    }

    public getEstruturaInformacoesAdicionaisValor(): Observable<InformacaoAdicionalAgrupador[]> {
        return this.getEstruturaInformacoesAdicionais().pipe(
            map((httpResponse) => {
                let agrupadores: InformacaoAdicionalAgrupador[] = [];
                let valor = JSON.parse(httpResponse.content.valor);

                if (!__isNullOrUndefined(valor) && valor.length >= 1) {
                    let semAgrupadorItens = valor.filter((currentItem) => {
                        return currentItem.tipo === InformacaoAdicionalAgrupadorTipoEnum.TEXTO;
                    });

                    if (!__isNullOrUndefined(semAgrupadorItens) && semAgrupadorItens.length >= 1) {
                        agrupadores.push({
                            tipo: InformacaoAdicionalAgrupadorTipoEnum.AGRUPADOR,
                            nome: SemAgrupadorNome,
                            rotulo: SemAgrupadorRotulo,
                            itens: semAgrupadorItens,
                        });
                    }

                    valor.forEach(function (currentItem) {
                        if (currentItem.tipo === InformacaoAdicionalAgrupadorTipoEnum.AGRUPADOR) {
                            agrupadores.push(currentItem);
                        }
                    });
                }

                return agrupadores;
            })
        );
    }
}
