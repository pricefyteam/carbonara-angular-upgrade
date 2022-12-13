import { Injectable } from "@angular/core";
import { untilDestroyed } from "@ngneat/until-destroy";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { HttpResponseInterface } from "pricefyfrontlib/app/shared/interfaces/pim/http-response.interface";
import { EMPTY, Observable } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ProvedorOutputInterface } from "src/app/@core/interfaces/models/provedor-output.interface";

import { ProvedoresService } from "./../../@core/services/provedores.service";
import { ProvidersStore } from "./providers.store";

@Injectable()
export class ProvidersEffects {
    constructor(
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private provedoresService: ProvedoresService,
        private providersStore: ProvidersStore
    ) {}

    readonly getProviders = this.providersStore.effect((trigger$: Observable<{ component?: any }>) => {
        return trigger$.pipe(
            switchMap((params) => {
                let observable;

                if (__isNullOrUndefined(params.component)) {
                    observable = this.provedoresService.obterProvedores();
                } else {
                    observable = this.provedoresService.obterProvedores().pipe(untilDestroyed(params.component));
                }

                return observable.pipe(
                    map((httpResponse: HttpResponseInterface<ProvedorOutputInterface[]>) => {
                        httpResponse.content.forEach((item) =>
                            this.providersStore.pushProvider(
                                this.providersStore.transformProvidersInterfaceUsingProvedoresOutputInterface(item)
                            )
                        );
                    }),
                    catchError((error: any) => {
                        if (error?.error?.responseMessage) {
                            this.toastrService.error(
                                error.error.responseMessage,
                                this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                            );
                        } else {
                            throw error;
                        }

                        return EMPTY;
                    })
                );
            })
        );
    });
}
