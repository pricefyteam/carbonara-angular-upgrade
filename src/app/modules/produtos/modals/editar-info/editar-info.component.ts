import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { ProdutosService } from "src/app/@core/services/produtos.service";
import { ProductInterface } from "src/app/@states/@interfaces/product.interface";
import { ProductsEffects } from "src/app/@states/products/products.effects";
import { ProductsStore } from "src/app/@states/products/products.store";
import { EditarProdutoInputInterface } from "../../../../@core/interfaces/models/editar-produto-input.interface";
import { ConfirmaSairComponent } from "../confirma-sair/confirma-sair.component";
import {
    getInformacaoAdicionalAgrupadorItemValor,
    InformacaoAdicionalAgrupador,
} from "../../../../@core/interfaces/entities/parametro-avancado.interface";
import { map } from "rxjs/operators";

@Component({
    selector: "app-editar-info",
    templateUrl: "./editar-info.component.html",
    styleUrls: ["./editar-info.component.scss"],
})
export class EditarInfoComponent implements OnInit {
    public payload: FormGroup = new FormGroup({});
    public product$: Observable<ProductInterface>;
    public productCode: string;
    public agrupador: InformacaoAdicionalAgrupador;

    constructor(
        private toastrService: ToastrService,
        private productStore: ProductsStore,
        private bsModalRef: BsModalRef,
        private produtosService: ProdutosService,
        private translateService: TranslateService,
        private productEffects: ProductsEffects,
        private bsModalService: BsModalService
    ) {}

    ngOnInit(): void {
        this.product$ = this.productStore.byCode$(this.productCode).pipe(
            map((product) => {
                this.agrupador.itens.forEach((item) => {
                    let value = getInformacaoAdicionalAgrupadorItemValor(product, this.agrupador, item);
                    this.payload.addControl(item.nome, new FormControl(value));
                });

                return product;
            })
        );
    }

    public submit(product: ProductInterface) {
        if (this.payload.valid) {
            if (!product.additionalInformation) {
                product.additionalInformation = {};
            }

            product.additionalInformation[this.agrupador.nome] = this.payload.getRawValue();

            let editarProdutoInput: EditarProdutoInputInterface = {
                id: product.id,
                descricaoPrincipal: product.mainDescription,
                descricaoSecundaria: product.secondaryDescription,
                descricaoEtiqueta: product.descriptionLabel,
                apresentacao: product.presentation,
                ativo: product.active,
                informacoesAdicionais: product.additionalInformation,
            };

            this.produtosService.editarInformacoesAdicionais(editarProdutoInput).subscribe(
                (httpResponse) => {
                    this.toastrService.success(this.translateService.instant("PRODUCT_SUCCESSFULLY_EDITED"));
                    this.bsModalRef.hide();

                    this.productStore.editProduct(product);
                },
                (httpResponseError) => {
                    this.toastrService.error(httpResponseError.message, this.translateService.instant("OOPS_SOMETHING_WENT_WRONG"));
                }
            );
        } else {
            this.payload.markAllAsTouched();
        }
    }

    /**
     * antes de fechar verifica se sofreu alguma alteracao no formulário
     *
     * @return void
     */
    public close() {
        if (this.payload.touched && this.payload.dirty) {
            this.bsModalService.show(ConfirmaSairComponent, {
                class: "confirma-sair",
                initialState: {
                    onSuccess: (bsModalRef: BsModalRef) => {
                        bsModalRef.hide();
                        this.bsModalRef.hide();
                    },
                },
            });
        } else {
            this.bsModalRef.hide();
        }
    }
}
