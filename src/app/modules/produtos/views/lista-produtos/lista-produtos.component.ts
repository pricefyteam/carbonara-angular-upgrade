import { ConfigService } from "./../../../../../../pricefyfrontlib/app/core/config/config.service";
import { Component, OnInit } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { TranslateService } from "@ngx-translate/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { HttpResponseInterface } from "../../../../@core/interfaces/http-response.interface";
import { Observable } from "rxjs";
import { __startDownloadByLink } from "src/app/@core/helpers/functions";
import { ProdutoInterface } from "src/app/@core/interfaces/entities/produto.interface";
import { ProdutosService } from "src/app/@core/services/produtos.service";
import { environment } from "src/environments/environment";

import { HttpErrorResponseInterface } from "./../../../../@core/interfaces/http-error-response.interface";
import { PesquisarProdutoInputInterface } from "./../../../../@core/interfaces/models/pesquisar-produto-input.interface";
import { ProductInterface } from "./../../../../@states/@interfaces/product.interface";
import { ProductsEffects } from "./../../../../@states/products/products.effects";
import { ProductsStore } from "./../../../../@states/products/products.store";
import { DetalhesProdutosComponent } from "./../../modals/detalhes-produtos/detalhes-produtos.component";
import { BuscaTextualService } from "src/app/@core/services/busca-textual.service";

export enum SearchProductsEnum {
    all = 1,
    active = 2,
    inactive = 3,
}

export interface SearchProductsInterface {
    type: SearchProductsEnum;
    description: string;
}

@UntilDestroy()
@Component({
    selector: "app-lista-produtos",
    templateUrl: "./lista-produtos.component.html",
    styleUrls: ["./lista-produtos.component.scss"],
})
export class ListaProdutosComponent implements OnInit {
    public products$: Observable<ProductInterface[]>;
    public resetForm: boolean = false;
    private maxRegister: number = environment.maxRegister;
    private page: number = 1;
    public isLoading$: Observable<boolean>;
    public hasMoreItems$: Observable<boolean>;

    public options: SearchProductsInterface[] = [
        { type: SearchProductsEnum.all, description: this.translateService.instant("ALL_PRODUCTS") },
        { type: SearchProductsEnum.active, description: this.translateService.instant("ACTIVE_PRODUCTS") },
        { type: SearchProductsEnum.inactive, description: this.translateService.instant("INACTIVE_PRODUCTS") },
    ];
    public selectedOption: SearchProductsEnum = SearchProductsEnum.all;

    private pesquisa: PesquisarProdutoInputInterface = {
        texto: "",
        ativos: null,
        incluirImagens: true,
        incluirFamilias: false,
    };

    constructor(
        private bsModalService: BsModalService,
        private productsStore: ProductsStore,
        private productsEffects: ProductsEffects,
        private configService: ConfigService,
        private produtosService: ProdutosService,
        private productStore: ProductsStore,
        private buscaTextualService: BuscaTextualService,
        private toastrService: ToastrService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.isLoading$ = this.productsEffects.isLoading$;
        this.hasMoreItems$ = this.productsEffects.hasMoreItems$;

        this.products$ = this.productsStore.products$;
        this.searchItems("");
    }

    public searchItems(search: string) {
        this.page = 1;
        this.pesquisa.texto = search;
        this.searchProducts();
        this.resetForm = false;
    }

    public selectItems() {
        this.page = 1;
        switch (this.selectedOption) {
            case SearchProductsEnum.active:
                this.pesquisa.ativos = true;
                break;
            case SearchProductsEnum.inactive:
                this.pesquisa.ativos = false;
                break;
            default:
                this.pesquisa.ativos = null;
                break;
        }

        this.searchProducts();
    }

    private searchProducts() {
        this.productsEffects.getProductsByText({
            pesquisaInput: this.pesquisa,
            page: this.page,
            maxRegister: this.maxRegister,
            component: this,
        });

        this.products$ = this.productsStore.products$;
    }

    public detailProduct(product: ProductInterface) {
        this.bsModalService.show(DetalhesProdutosComponent, {
            initialState: {
                productCode: product.code,
            },
            class: "modal-dialog-centered",
        });
    }

    public indexProduct(product: ProductInterface) {
        this.buscaTextualService.indexItem(product.code, "produto").subscribe(
            () => {
                this.toastrService.success(this.translateService.instant("INDEX_ON_FTS_SUCCESS"));
            },
            (httpResponseError: HttpErrorResponseInterface) => {
                this.toastrService.error(httpResponseError.message, this.translateService.instant("OOPS_SOMETHING_WENT_WRONG"));
            }
        );
    }

    public changeStatusProduct(product: ProductInterface) {
        let observable: Observable<HttpResponseInterface<ProdutoInterface>>;

        if (product.active) {
            observable = this.produtosService.inativarProduto(product.id);
            product.active = false;
        } else {
            observable = this.produtosService.ativarProduto(product.id);
            product.active = true;
        }

        observable.subscribe(
            () => {
                this.productStore.updateProduct(product);
                this.searchProducts();
            },
            (httpResponseError: HttpErrorResponseInterface) => {
                this.toastrService.error(httpResponseError.message, this.translateService.instant("OOPS_SOMETHING_WENT_WRONG"));
            }
        );
    }

    public resetSearch() {
        this.resetForm = true;
    }

    public onScroll(hasMoreItems: boolean) {
        if (hasMoreItems) {
            this.page++;
            this.searchProducts();
        }
    }

    public downloadFile() {
        __startDownloadByLink("https://s3.amazonaws.com/pricefy-stage/Produtos/modelo/importacaoprodutosexemplo.csv", "download");
    }

    redirectToConnect() {
        const url = this.configService.getConfiguration().pricefyWebUrl;
        const uri = `connect/#/importacoes`;
        window.open(`${url}${uri}`);
    }
}
