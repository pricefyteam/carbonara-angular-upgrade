import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { __isEmpty, __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { Observable, Subscription } from "rxjs";
import { environment } from "src/environments/environment";

import { ProductInterface } from "../../../../@states/@interfaces/product.interface";
import { ProvidersInterface } from "../../../../@states/@interfaces/providers.interface";
import { ProductsEffects } from "../../../../@states/products/products.effects";
import { ProductsStore } from "../../../../@states/products/products.store";
import { ProvidersStore } from "../../../../@states/providers/providers.store";
import { FamiliasManipulacaoComponent } from "../../../familias/modals/familias-manipulacao/familias-manipulacao.component";
import { DetalhesCatalogoProdutoComponent } from "./../../modals/detalhes-catalogo-produto/detalhes-catalogo-produto.component";
import { DetalhesProdutoFamiliaComponent } from "./../../modals/detalhes-produto-familia/detalhes-produto-familia.component";

@Component({
    selector: "app-resultados",
    templateUrl: "./resultados.component.html",
    styleUrls: ["./resultados.component.scss"],
})
export class ResultadosComponent implements OnInit {
    public searchInput: FormControl = new FormControl("");
    public searchForm: FormGroup;
    public products$: Observable<ProductInterface[]>;
    public isLoading: boolean = true;
    private maxRegister: number = environment.maxRegister;
    private page: number = 1;
    private loadingSubscription: Subscription;
    private hasMoreItemsSubscription: Subscription;
    private hasMoreItems: boolean = true;
    private pesquisa: string = "";
    private somenteComThumbnail: boolean = true;
    public type: string = "";
    public showItems: boolean = true;
    public value: string = "";

    constructor(
        private productsStore: ProductsStore,
        private productsEffects: ProductsEffects,
        private providersStore: ProvidersStore,
        private bsModalService: BsModalService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.value = "";
            if (!__isEmpty(params.search)) {
                this.value = params.search;
            }
            this.searchItems(params.search);
        });
    }

    public searchItems(search: string) {
        if (search !== "") {
            this.pesquisa = search;
            this.resetPageAndSearch();
        }
    }

    public resetPageAndSearch() {
        this.page = 1;
        this.searchProducts();
    }

    public changeType() {
        this.showItems = false;
        this.resetPageAndSearch();
    }

    private searchProducts() {
        this.productsEffects.getProducts({
            search: this.pesquisa,
            page: this.page,
            maxRegister: this.maxRegister,
            type: this.type,
            component: this,
            somenteComThumbnail: this.somenteComThumbnail,
        });

        this.products$ = this.productsStore.products$;

        this.loadingSubscription = this.productsEffects.isLoading$.subscribe((loading) => {
            this.isLoading = loading;
            if (!this.isLoading) this.showItems = true;
        });
        this.hasMoreItemsSubscription = this.productsEffects.hasMoreItems$.subscribe((hasMoreItems) => {
            this.hasMoreItems = hasMoreItems;
        });
    }

    public detailsProduct(product: ProductInterface) {
        if (product.type === "catalogo-produto")
            this.bsModalService.show(DetalhesCatalogoProdutoComponent, {
                initialState: {
                    codeProvider: product.codeProvider,
                    gtin: product.gtin,
                },
            });
        else
            this.bsModalService.show(DetalhesProdutoFamiliaComponent, {
                initialState: {
                    type: product.type,
                    itemCode: product.code,
                },
            });
    }

    public getProviderLogo(code: string): string {
        let urlThumbnail: string = "";
        this.providersStore.byCode$(code).subscribe((httpResponse: ProvidersInterface) => {
            if (httpResponse?.urlThumbnail) urlThumbnail = httpResponse.urlThumbnail;
        });

        return urlThumbnail;
    }

    public onScroll() {
        if (this.hasMoreItems) {
            this.page++;
            this.searchProducts();
        }
    }

    public abrirModalFamiliaManipulacao() {
        this.bsModalService.show(FamiliasManipulacaoComponent);
    }

    public importarProdutos() {
        window.open("/Admin/Produtos", "_blank");
    }

    ngOnDestroy(): void {
        if (!__isNullOrUndefined(this.hasMoreItemsSubscription)) {
            this.hasMoreItemsSubscription.unsubscribe();
        }

        if (!__isNullOrUndefined(this.loadingSubscription)) {
            this.loadingSubscription.unsubscribe();
        }
    }
}
