import { Injectable } from "@angular/core";
import { untilDestroyed } from "@ngneat/until-destroy";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ProdutoOuFamiliaOutputInterface } from "src/app/@core/interfaces/entities/produto-ou-familia-output.interface";
import { ProdutoInterface } from "src/app/@core/interfaces/entities/produto.interface";
import { PesquisarProdutoInputInterface } from "src/app/@core/interfaces/models/pesquisar-produto-input.interface";
import { ProdutosService } from "src/app/@core/services/produtos.service";

import { HttpResponseCodes, HttpResponseInterface } from "../../@core/interfaces/http-response.interface";
import { AutocompleteOutputInterface } from "./../../@core/interfaces/models/autocomplete-output.interface";
import { PesquisaPaginadaOutputInterface } from "./../../@core/interfaces/models/pesquisa-paginada-output.interface";
import { BuscaTextualService } from "./../../@core/services/busca-textual.service";
import { ProductInterface } from "./../@interfaces/product.interface";
import { ProductsStore } from "./products.store";

import { TipoMidiaEnum } from "src/app/@core/interfaces/entities/produto-tipo-midia-enum.interface";
import { ProdutoMidiaInterface } from "src/app/@core/interfaces/entities/produto-midia.interface";

@Injectable()
export class ProductsEffects {
    public isLoading$ = new BehaviorSubject<boolean>(true);
    public hasMoreItems$ = new BehaviorSubject<boolean>(true);

    constructor(
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private productsStore: ProductsStore,
        private buscaTextualService: BuscaTextualService,
        private produtosService: ProdutosService
    ) {}

    readonly getProducts = this.productsStore.effect(
        (
            trigger$: Observable<{
                search: string;
                page: number;
                maxRegister: number;
                type: string;
                somenteComThumbnail: boolean;
                component?: any;
            }>
        ) => {
            return trigger$.pipe(
                switchMap((params) => {
                    let observable;
                    this.isLoading$.next(true);

                    if (__isNullOrUndefined(params.component)) {
                        observable = this.buscaTextualService.getItens(
                            params.search,
                            params.page,
                            params.maxRegister,
                            params.type,
                            params.somenteComThumbnail
                        );
                    } else {
                        observable = this.buscaTextualService
                            .getItens(params.search, params.page, params.maxRegister, params.type, params.somenteComThumbnail)
                            .pipe(untilDestroyed(params.component));
                    }

                    return observable.pipe(
                        map((httpResponse: HttpResponseInterface<AutocompleteOutputInterface<ProdutoOuFamiliaOutputInterface>>) => {
                            const products: ProductInterface[] = [];
                            httpResponse.content.itens.forEach((produto) => {
                                products.push(
                                    this.productsStore.transformProductInterfaceUsingProdutoOuFamiliaOutputInterface(produto.dados)
                                );
                            });

                            if (params.page === 1) {
                                this.productsStore.setProducts(products);
                            } else {
                                this.productsStore.pushProducts(products);
                            }

                            this.isLoading$.next(false);
                        }),
                        catchError((error: any) => {
                            this.isLoading$.next(false);

                            if (error?.error?.responseMessage) {
                                const message =
                                    error.error.responseCode === HttpResponseCodes._666
                                        ? this.translateService.instant("ERROR_ON_FTS_SERVICE")
                                        : error.error.responseMessage;

                                this.toastrService.error(message, this.translateService.instant("OOPS_SOMETHING_WENT_WRONG"));
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

    readonly getProductsByText = this.productsStore.effect(
        (trigger$: Observable<{ pesquisaInput: PesquisarProdutoInputInterface; page: number; maxRegister: number; component?: any }>) => {
            return trigger$.pipe(
                switchMap((params) => {
                    let observable;
                    this.isLoading$.next(true);

                    if (__isNullOrUndefined(params.component)) {
                        observable = this.produtosService.getProdutos(params.pesquisaInput, params.page, params.maxRegister);
                    } else {
                        observable = this.produtosService
                            .getProdutos(params.pesquisaInput, params.page, params.maxRegister)
                            .pipe(untilDestroyed(params.component));
                    }

                    return observable.pipe(
                        map((httpResponse: HttpResponseInterface<PesquisaPaginadaOutputInterface<ProdutoInterface>>) => {
                            const products: ProductInterface[] = [];
                            httpResponse.content.itens.forEach((item) => {
                                products.push(this.productsStore.transformProductInterfaceUsingProdutoInterface(item));
                            });

                            if (params.page === 1) {
                                this.productsStore.setProducts(products);
                            } else {
                                this.productsStore.pushProducts(products);
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

    readonly getProductByCode = this.productsStore.effect(
        (
            trigger$: Observable<{
                code: string;
                incluirImagens: boolean;
                incluirFamilia: boolean;
                incluirEstruturaMercadologica: boolean;
                incluirGtins: boolean;
                component?: any;
            }>
        ) => {
            return trigger$.pipe(
                switchMap((params) => {
                    let observable;
                    this.isLoading$.next(true);

                    if (__isNullOrUndefined(params.component)) {
                        observable = this.produtosService.getProdutoByCodigo(
                            params.code,
                            params.incluirImagens,
                            params.incluirFamilia,
                            params.incluirEstruturaMercadologica,
                            params.incluirGtins
                        );
                    } else {
                        observable = this.produtosService
                            .getProdutoByCodigo(
                                params.code,
                                params.incluirImagens,
                                params.incluirFamilia,
                                params.incluirEstruturaMercadologica,
                                params.incluirGtins
                            )
                            .pipe(untilDestroyed(params.component));
                    }

                    return observable.pipe(
                        map((httpResponse: HttpResponseInterface<ProdutoInterface>) => {
                            this.productsStore.updateProduct(
                                this.productsStore.transformProductInterfaceUsingProdutoInterface(httpResponse.content)
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

    readonly getMidiaByProductCode = this.productsStore.effect(
        (
            trigger$: Observable<{
                productCode: string;
                tipoMidia: TipoMidiaEnum;
                component?: any;
            }>
        ) => {
            return trigger$.pipe(
                switchMap((params) => {
                    let observable;
                    this.isLoading$.next(true);

                    if (__isNullOrUndefined(params.component)) {
                        observable = this.produtosService.getMidia(params.productCode, params.tipoMidia);
                    } else {
                        observable = this.produtosService
                            .getMidia(params.productCode, params.tipoMidia)
                            .pipe(untilDestroyed(params.component));
                    }

                    return observable.pipe(
                        map((httpResponse: HttpResponseInterface<ProdutoMidiaInterface[]>) => {
                            httpResponse.content.forEach((item) => {
                                this.productsStore.addMidia(this.productsStore.transformMidiaInterfaceUsingProductMidiaInterface(item));
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
