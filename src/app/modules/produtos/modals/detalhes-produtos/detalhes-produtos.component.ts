import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { __isEmpty } from "pricefyfrontlib/app/shared/helpers/functions";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { __getThumbnailURLFromImages } from "src/app/@core/helpers/functions";
import { ListImagesEnum } from "../../../../@core/components/lista-imagens/list-images.enum";
import { DepartmentInterface } from "./../../../../@states/@interfaces/department.interface";
import { ProductGtinInterface } from "./../../../../@states/@interfaces/product-gtin.interface";
import { ProductInterface } from "./../../../../@states/@interfaces/product.interface";
import { ProductsEffects } from "./../../../../@states/products/products.effects";
import { ProductsStore } from "./../../../../@states/products/products.store";
import { EditarProdutoComponent } from "../editar-produto/editar-produto.component";
import { ISuperCardTabs, SuperCardOptions } from "../../../../../../pricefyfrontlib/app/shared/components/super-card/super-card.interfaces";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "app-detalhes-produtos",
    templateUrl: "./detalhes-produtos.component.html",
    styleUrls: ["./detalhes-produtos.component.scss"],
})
export class DetalhesProdutosComponent implements OnInit {
    public productCode: string;
    public product$: Observable<ProductInterface>;
    public product: ProductInterface;
    public processing: boolean = false;
    public listImagesEnum: typeof ListImagesEnum = ListImagesEnum;
    public destinationCode = "desc";
    public destinationDescription = "desc";
    public marketingStructure: string = "";
    public productGtins: ProductGtinInterface[] = [];
    public activeTab: ISuperCardTabs;

    public superCardProdutosOptions = new SuperCardOptions();

    constructor(
        private bsModalService: BsModalService,
        private productStore: ProductsStore,
        private productEffects: ProductsEffects,
        private bsModalRef: BsModalRef,
        private translateService: TranslateService
    ) {
        this.configSuperCardProdutos();
    }

    ngOnInit(): void {
        this.product$ = this.productStore.byCode$(this.productCode).pipe(
            map((product) => {
                this.product = _.cloneDeep(product);

                // Recebendo os dados da estrutura mercadológica. Recupera o departamento que não tem departamento pai
                this.marketingStructure = "";
                const actualDepartment: DepartmentInterface = this.product.marketingStructure.find((dep) => dep.departmentFatherId === 0);
                if (actualDepartment) {
                    this.getMarketingStructure(actualDepartment);
                    this.marketingStructure = this.marketingStructure.slice(0, -2);
                }

                // Recebendo os Gtins secundários
                this.productGtins = [];
                this.productGtins = this.product.productGtins.filter(
                    (productGtin) => productGtin.main === false && productGtin.active === true
                );

                this.superCardProdutosOptions.title = this.product.mainDescription + " " + this.product.secondaryDescription;

                return product;
            })
        );

        this.productEffects.getProductByCode({
            code: this.productCode,
            incluirImagens: true,
            incluirFamilia: true,
            incluirEstruturaMercadologica: true,
            incluirGtins: true,
            component: this,
        });
    }

    configSuperCardProdutos() {
        this.superCardProdutosOptions.widgetId = "superCardProdutos";
        this.superCardProdutosOptions.tabs = [
            <ISuperCardTabs>{
                description: this.translateService.instant("MAIN"),
                tabOrder: 0,
                widgetId: "principal",
                icon: "bi bi-upc",
                disabled: false,
            },
            <ISuperCardTabs>{
                description: this.translateService.instant("INFO_ADDITIONAL"),
                tabOrder: 1,
                widgetId: "informacoesAdicionais",
                icon: "bi bi-info-circle",
                disabled: false,
            },
            <ISuperCardTabs>{
                description: this.translateService.instant("PHOTOS"),
                tabOrder: 2,
                widgetId: "fotos",
                icon: "bi bi-images",
                disabled: false,
            },
            <ISuperCardTabs>{
                description: this.translateService.instant("BANNER"),
                tabOrder: 3,
                widgetId: "banner",
                icon: "bi bi-image",
                disabled: false,
            },
            <ISuperCardTabs>{
                description: this.translateService.instant("VIDEOS"),
                tabOrder: 4,
                widgetId: "videos",
                icon: "bi bi-play",
                disabled: false,
            },
        ];
        this.superCardProdutosOptions.selectTab = ($event: any) => (this.activeTab = $event);
        this.superCardProdutosOptions.onClose = ($event: any) => this.onCloseSuperCard($event);
        this.activeTab = this.superCardProdutosOptions.tabs[0];
    }

    get hasImage(): boolean {
        return !__isEmpty(this.product.urlThumbnailMain);
    }

    get isInactive(): boolean {
        if (this.product["active"] !== undefined && !this.product["active"]) {
            return true;
        }
        return false;
    }

    private getMarketingStructure(department: DepartmentInterface) {
        this.marketingStructure += `${department?.name} > `;
        const actualDepartment = this.product.marketingStructure.find((dep) => dep.departmentFatherId === department.id);

        if (actualDepartment) {
            this.getMarketingStructure(actualDepartment);
        }
    }

    public getThumbnailURL(imagens) {
        return __getThumbnailURLFromImages(imagens);
    }

    private onCloseSuperCard($event: any) {
        this.bsModalRef.hide();
    }

    public editProduto() {
        this.bsModalService.show(EditarProdutoComponent, { initialState: { product: this.product }, class: "modal-dialog-centered" });
    }
}
