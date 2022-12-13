import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { SelectProdutosFamiliasComponent } from "pricefyfrontlib/app/shared/components/select-produtos-familias/select-produtos-familias.component";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { forkJoin, Observable, of } from "rxjs";
import { ItemInterface } from "src/app/@core/components/select-produtos-familias/item.interface";
import { __getThumbnailURLFromImages } from "src/app/@core/helpers/functions";
import { FamiliaInterface } from "src/app/@core/interfaces/entities/familia.interface";
import { FamiliasService } from "src/app/@core/services/familias.service";

import { HttpErrorResponseInterface } from "../../../../@core/interfaces/http-error-response.interface";
import { HttpResponseInterface } from "../../../../@core/interfaces/http-response.interface";
import { FamiliesStore } from "../../../../@states/families/families.store";
import { ProdutoInterface } from "../../../../@core/interfaces/entities/produto.interface";
import { FamiliaInputInterface } from "../../../../@core/interfaces/models/familia-input.interface";
import { ProductFamilyImageInterface } from "../../../../@states/@interfaces/product-family-image.interface";
import { ProductInterface } from "../../../../@states/@interfaces/product.interface";
import { ProductsStore } from "../../../../@states/products/products.store";
import { ProdutoImagemInterface } from "../../../../@core/interfaces/entities/produto-imagem.interface";

@Component({
    selector: "app-editar-informacoes",
    templateUrl: "./editar-informacoes.component.html",
    styleUrls: ["./editar-informacoes.component.scss"],
})
export class EditarInformacoesComponent implements OnInit {
    @ViewChild("selectProdutosFamiliasComponent") public selectProdutosFamiliasComponent: SelectProdutosFamiliasComponent;
    public processing: boolean = false;
    public modalTitle: string = "";
    public withoutOptions: boolean = false;
    public destinationCode: string = "desc";
    public destinationDescription: string = "desc";
    public editingFamilyId: number;

    //lista de produtos atual, representa tanto os produtos de uma família que está sendo cadastrada/editada.
    public products: ProdutoInterface[] = [];

    //lista de produtos recebidos quando a família é editada, usada para identificar quais produtos foram adicionados/removidos.
    public productsReceived: ProdutoInterface[] = [];

    public payload: FormGroup = new FormGroup({
        mainDescription: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
        secondaryDescription: new FormControl(""),
        code: new FormControl(""),
    });

    constructor(
        public bsModalRef: BsModalRef,
        private translateService: TranslateService,
        private toastrService: ToastrService,
        private familiasService: FamiliasService,
        private router: Router,
        private familiesStore: FamiliesStore,
        private productsStore: ProductsStore,
        private bsModalService: BsModalService
    ) {}

    ngOnInit(): void {
        if (this.isEditing) {
            this.processing = true;
            this.modalTitle = this.translateService.instant("EDIT_FAMILY");
            this.familiesStore.byId$(this.editingFamilyId).subscribe((family) => {
                this.mainDescription.setValue(family.mainDescription);
                this.secondaryDescription.setValue(family.secondaryDescription);
                this.code.setValue(family.code);
                this.products = _.cloneDeep(this.transformProdutoInterfaceUsingFamilyProductInterface(family.products));
                this.productsReceived = _.cloneDeep(this.transformProdutoInterfaceUsingFamilyProductInterface(family.products));
            });
            this.processing = false;
        } else {
            this.modalTitle = this.translateService.instant("CREATE_NEW_FAMILY");
        }
    }

    get isEditing(): boolean {
        return !__isNullOrUndefined(this.editingFamilyId);
    }

    get mainDescription() {
        return this.payload.get("mainDescription");
    }

    get secondaryDescription() {
        return this.payload.get("secondaryDescription");
    }

    get code() {
        return this.payload.get("code");
    }

    get productsIdsRemoved(): number[] {
        return this.productsReceived
            .filter((productReceived) => {
                return this.products.filter((product) => product.id === productReceived.id).length === 0;
            })
            .map((item) => item.id);
    }

    get productsIdsAdded(): number[] {
        return this.products
            .filter((product) => {
                return this.productsReceived.filter((productReceived) => productReceived.id === product.id).length === 0;
            })
            .map((item) => item.id);
    }

    public addProduct(item: ItemInterface) {
        let product: ProdutoInterface = <ProdutoInterface>item.primitive;
        if (this.products.indexOf(product) === -1) {
            this.products.push(product);
        }
    }

    public removeProduct(product: ProdutoInterface) {
        this.products = this.products.filter((item) => item.id !== product.id);
    }

    public getThumbnailURL(imagens) {
        return __getThumbnailURLFromImages(imagens);
    }

    private serviceAdicionarProdutos(
        familia: FamiliaInterface,
        produtosIds: number[]
    ): Observable<HttpResponseInterface<FamiliaInterface> | false> {
        if (produtosIds.length) {
            return this.familiasService.adicionarProdutos(familia.id, produtosIds);
        } else {
            return of(false);
        }
    }

    private serviceRemoverProdutos(
        familia: FamiliaInterface,
        produtosIds: number[]
    ): Observable<HttpResponseInterface<FamiliaInterface> | false> {
        if (produtosIds.length) {
            return this.familiasService.removerProdutos(familia.id, produtosIds);
        } else {
            return of(false);
        }
    }

    public submit() {
        if (this.payload.invalid || this.products.length === 0) {
            if (this.products.length === 0) {
                this.selectProdutosFamiliasComponent.forceInvalid = true;
            }
            this.payload.markAllAsTouched();
        } else {
            this.processing = true;

            let familiaInput: FamiliaInputInterface = {
                codigo: "",
                descricaoPrincipal: this.mainDescription.value,
                descricaoSecundaria: this.secondaryDescription.value,
            };

            if (this.isEditing) {
                familiaInput.codigo = this.code.value;

                this.familiasService.editarFamilia(this.editingFamilyId, familiaInput).subscribe(
                    (httpResponseEditarFamilia) => {
                        let familiaEditada: FamiliaInterface = httpResponseEditarFamilia.content;
                        this.familiesStore.editFamily(this.familiesStore.transformFamilyInterfaceUsingFamiliaInterface(familiaEditada));

                        familiaEditada.produtos = this.products;

                        forkJoin([
                            this.serviceAdicionarProdutos(familiaEditada, this.productsIdsAdded),
                            this.serviceRemoverProdutos(familiaEditada, this.productsIdsRemoved),
                        ]).subscribe(
                            () => {
                                const products: ProductInterface[] = this.products.map((product) => {
                                    return this.productsStore.transformProductInterfaceUsingProdutoInterface(product);
                                });

                                this.familiesStore.updateProducts({ familyId: familiaEditada.id, products: products });
                                this.bsModalRef.hide();
                                this.toastrService.success(this.translateService.instant("FAMILY_SUCCESSFULLY_EDITED"));
                                this.processing = false;
                            },
                            (error) => this.handlerErrorResponse(error)
                        );
                    },
                    (error) => this.handlerErrorResponse(error)
                );
            }
        }
    }

    private handlerErrorResponse(httpErrorResponse: HttpErrorResponseInterface) {
        this.processing = false;
        this.toastrService.error(httpErrorResponse.error.responseMessage, this.translateService.instant("OOPS_SOMETHING_WENT_WRONG"));
    }

    private transformProdutoInterfaceUsingFamilyProductInterface(productsInterface: ProductInterface[]): ProdutoInterface[] {
        const products: ProdutoInterface[] = [];
        productsInterface.forEach((item) => {
            let product: ProdutoInterface = {
                id: item.id,
                codigo: item.code,
                descricaoPrincipal: item.mainDescription,
                descricaoSecundaria: item.secondaryDescription,
                estruturaMercadologica: item.marketingStructure,
                gtin: item.gtin,
                familias: [],
                imagens: this.transformProdutoImagemInterfaceUsingProductFamilyImageInterface(item.images),
                ativo: item.active,
            };

            products.push(product);
        });

        return products;
    }

    private transformProdutoImagemInterfaceUsingProductFamilyImageInterface(
        productFamilyImageInterface: ProductFamilyImageInterface[]
    ): ProdutoImagemInterface[] {
        const productImages: ProdutoImagemInterface[] = [];
        productFamilyImageInterface.forEach((item) => {
            let productImage: ProdutoImagemInterface = {
                id: item.id,
                principal: item.main,
                produtoId: item.productId,
                url: item.url,
                urlThumbnail: item.urlThumbnail,
            };

            productImages.push(productImage);
        });

        return productImages;
    }
}
