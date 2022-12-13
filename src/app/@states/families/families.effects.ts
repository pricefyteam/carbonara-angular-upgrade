import { Injectable } from "@angular/core";
import { untilDestroyed } from "@ngneat/until-destroy";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { BehaviorSubject, EMPTY, Observable } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { FamiliaMidiaInterface } from "src/app/@core/interfaces/entities/familia-midia.interface";
import { TipoMidiaFamiliaEnum } from "src/app/@core/interfaces/entities/familia-tipo-midia-enum.interface";
import { PesquisaPaginadaOutputInterface } from "src/app/@core/interfaces/models/pesquisa-paginada-output.interface";
import { PesquisarFamiliaInputInterface } from "src/app/@core/interfaces/models/pesquisar-familia-input";
import { FamiliasService } from "src/app/@core/services/familias.service";

import { HttpResponseInterface } from "../../@core/interfaces/http-response.interface";
import { FamiliaInterface } from "./../../@core/interfaces/entities/familia.interface";
import { FamilyInterface } from "./../@interfaces/family.interface";
import { FamiliesStore } from "./families.store";

@Injectable()
export class FamiliesEffects {
    public isLoading$ = new BehaviorSubject<boolean>(true);
    public hasMoreItems$ = new BehaviorSubject<boolean>(true);

    constructor(
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private familiaService: FamiliasService,
        private familiesStore: FamiliesStore
    ) {}

    readonly getFamilyDetails = this.familiesStore.effect((trigger$: Observable<{ familyId: number; component?: any }>) => {
        return trigger$.pipe(
            switchMap((params) => {
                let observable;

                if (__isNullOrUndefined(params.component)) {
                    observable = this.familiaService.getFamiliaPorId(params.familyId);
                } else {
                    observable = this.familiaService.getFamiliaPorId(params.familyId).pipe(untilDestroyed(params.component));
                }

                return observable.pipe(
                    map((httpResponse: HttpResponseInterface<FamiliaInterface>) => {
                        this.familiesStore.addFamily(
                            this.familiesStore.transformFamilyInterfaceUsingFamiliaInterface(httpResponse.content)
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

    readonly getFamiliesByText = this.familiesStore.effect(
        (trigger$: Observable<{ pesquisaInput: PesquisarFamiliaInputInterface; page: number; maxRegister: number; component?: any }>) => {
            return trigger$.pipe(
                switchMap((params) => {
                    let observable;
                    this.isLoading$.next(true);

                    if (__isNullOrUndefined(params.component)) {
                        observable = this.familiaService.getFamilias(params.pesquisaInput, params.page, params.maxRegister);
                    } else {
                        observable = this.familiaService
                            .getFamilias(params.pesquisaInput, params.page, params.maxRegister)
                            .pipe(untilDestroyed(params.component));
                    }

                    return observable.pipe(
                        map((httpResponse: HttpResponseInterface<PesquisaPaginadaOutputInterface<FamiliaInterface>>) => {
                            const families: FamilyInterface[] = [];
                            httpResponse.content.itens.forEach((item) => {
                                families.push(this.familiesStore.transformFamilyInterfaceUsingFamiliaInterface(item));
                            });

                            if (params.page === 1) {
                                this.familiesStore.setFamily(families);
                            } else {
                                this.familiesStore.pushFamily(families);
                            }

                            // Verifica se existe mais itens para serem carregados
                            if (httpResponse.content.pagina < httpResponse.content.quantidadePaginas) {
                                this.hasMoreItems$.next(true);
                            } else {
                                this.hasMoreItems$.next(false);
                            }

                            this.isLoading$.next(false);
                        }),
                        catchError((error: any) => {
                            this.isLoading$.next(false);
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
        }
    );

    readonly getFamilyByCode = this.familiesStore.effect(
        (
            trigger$: Observable<{
                code: string;
                incluirImagens: boolean;
                incluirProdutos: boolean;
                incluirImagensProduto: boolean;
                component?: any;
            }>
        ) => {
            return trigger$.pipe(
                switchMap((params) => {
                    let observable;
                    this.isLoading$.next(true);

                    if (__isNullOrUndefined(params.component)) {
                        observable = this.familiaService.getFamiliaPorCodigo(
                            params.code,
                            params.incluirImagens,
                            params.incluirProdutos,
                            params.incluirImagensProduto
                        );
                    } else {
                        observable = this.familiaService
                            .getFamiliaPorCodigo(params.code, params.incluirImagens, params.incluirProdutos, params.incluirImagensProduto)
                            .pipe(untilDestroyed(params.component));
                    }

                    return observable.pipe(
                        map((httpResponse: HttpResponseInterface<FamiliaInterface>) => {
                            this.familiesStore.updateFamily(
                                this.familiesStore.transformFamilyInterfaceUsingFamiliaInterface(httpResponse.content)
                            );
                            this.isLoading$.next(false);
                        }),
                        catchError((error: any) => {
                            this.isLoading$.next(false);
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
        }
    );

    readonly getMidiaByFamilyCode = this.familiesStore.effect(
        (
            trigger$: Observable<{
                familyCode: string;
                tipoMidia: TipoMidiaFamiliaEnum;
                component?: any;
            }>
        ) => {
            return trigger$.pipe(
                switchMap((params) => {
                    let observable;
                    this.isLoading$.next(true);

                    if (__isNullOrUndefined(params.component)) {
                        observable = this.familiaService.getMidia(params.familyCode, params.tipoMidia);
                    } else {
                        observable = this.familiaService
                            .getMidia(params.familyCode, params.tipoMidia)
                            .pipe(untilDestroyed(params.component));
                    }

                    return observable.pipe(
                        map((httpResponse: HttpResponseInterface<FamiliaMidiaInterface[]>) => {
                            httpResponse.content.forEach((item) => {
                                this.familiesStore.addMidiaFamily(
                                    this.familiesStore.transformMidiaInterfaceUsingFamilyMidiaInterface(item)
                                );
                            });

                            this.isLoading$.next(false);
                        }),
                        catchError((error: any) => {
                            this.isLoading$.next(false);
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
        }
    );
}
