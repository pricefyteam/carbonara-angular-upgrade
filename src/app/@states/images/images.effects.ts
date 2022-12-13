import { Injectable } from "@angular/core";
import { untilDestroyed } from "@ngneat/until-destroy";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { EMPTY, Observable } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

import { CatalogoProdutoInterface } from "../../@core/interfaces/entities/catalogo-produto.interface";
import { HttpResponseInterface } from "../../@core/interfaces/http-response.interface";
import { CatalogoProdutosService } from "../../@core/services/catalogo-produtos.service";
import { ImageInterface } from "../@interfaces/image.interface";
import { CatalogoProdutoImagemInterface } from "./../../@core/interfaces/entities/catalogo-produto-imagem.interface";
import { ProductInterface } from "./../@interfaces/product.interface";
import { ProductsStore } from "./../products/products.store";
import { ImagesStore } from "./images.store";

@Injectable()
export class ImagesEffects {
    constructor(
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private catalogoProdutosService: CatalogoProdutosService,
        private imagesStore: ImagesStore,
        private productsStore: ProductsStore
    ) {}

    readonly getImages = this.imagesStore.effect((trigger$: Observable<{ gtin: string; codeProvider: string; component?: any }>) => {
        return trigger$.pipe(
            switchMap((params) => {
                let observable;

                if (__isNullOrUndefined(params.component)) {
                    observable = this.catalogoProdutosService.getProdutoImagens(params.gtin, params.codeProvider);
                } else {
                    observable = this.catalogoProdutosService
                        .getProdutoImagens(params.gtin, params.codeProvider)
                        .pipe(untilDestroyed(params.component));
                }

                return observable.pipe(
                    map((httpResponse: HttpResponseInterface<CatalogoProdutoInterface>) => {
                        this.productsStore.addProduct(
                            this.transformProductInterfaceUsingCatalogoProdutoImagemInterface(httpResponse.content)
                        );
                        httpResponse.content.imagens.forEach((item) =>
                            this.imagesStore.addImage(this.transformImageInterfaceUsingCatalogoProdutoImagemInterface(item, params.gtin))
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

    private transformImageInterfaceUsingCatalogoProdutoImagemInterface(
        catalogoProdutoImagemInterface: CatalogoProdutoImagemInterface,
        gtin: string
    ): ImageInterface {
        return {
            catalogProductId: catalogoProdutoImagemInterface.catalogoProdutoId,
            url: catalogoProdutoImagemInterface.url,
            systemColor: catalogoProdutoImagemInterface.sistemaCores,
            width: catalogoProdutoImagemInterface.width,
            height: catalogoProdutoImagemInterface.height,
            dpi: catalogoProdutoImagemInterface.dpi,
            format: catalogoProdutoImagemInterface.formato,
            grouper: catalogoProdutoImagemInterface.agrupador,
            main: catalogoProdutoImagemInterface.principal,
            thumbnail: catalogoProdutoImagemInterface.thumbnail,
            productGtin: gtin,
        };
    }

    private transformProductInterfaceUsingCatalogoProdutoImagemInterface(
        catalogoProdutoInterface: CatalogoProdutoInterface
    ): ProductInterface {
        return {
            gtin: catalogoProdutoInterface.gtin,
            mainDescription: catalogoProdutoInterface.descricao,
        };
    }
}
