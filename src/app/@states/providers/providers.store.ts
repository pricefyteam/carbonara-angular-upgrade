import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { Observable } from "rxjs";

import { ProvedorOutputInterface } from "./../../@core/interfaces/models/provedor-output.interface";
import { ProvidersInterface } from "./../@interfaces/providers.interface";

@Injectable()
export class ProvidersStore extends ComponentStore<{ providers: ProvidersInterface[] }> {
    constructor() {
        super({ providers: [] });
    }

    byCode$(code: string): Observable<ProvidersInterface> {
        return this.select((state) => {
            return state.providers.find((provider) => provider.code === code);
        });
    }

    readonly pushProvider = this.updater((state, provider: ProvidersInterface) => {
        let exists = state.providers.find((item) => item.code === provider.code);

        if (__isNullOrUndefined(exists)) {
            state.providers.push(provider);
        }

        return state;
    });

    public transformProvidersInterfaceUsingProvedoresOutputInterface(provedor: ProvedorOutputInterface): ProvidersInterface {
        return {
            code: provedor.codigo,
            description: provedor.descricao,
            urlThumbnail: provedor.urlThumbnailLogo,
        };
    }
}
