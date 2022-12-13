import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { EditarProdutoInputInterface } from "src/app/@core/interfaces/models/editar-produto-input.interface";
import { ProdutosService } from "src/app/@core/services/produtos.service";
import { ProductInterface } from "src/app/@states/@interfaces/product.interface";
import { ProductsStore } from "src/app/@states/products/products.store";
import { ConfirmaSairComponent } from "../confirma-sair/confirma-sair.component";

@Component({
    selector: "app-editar-produto",
    templateUrl: "./editar-produto.component.html",
    styleUrls: ["./editar-produto.component.scss"],
})
export class EditarProdutoComponent implements OnInit {
    public product: ProductInterface;
    public payload: FormGroup;

    constructor(
        private toastrService: ToastrService,
        private productStore: ProductsStore,
        private bsModalRef: BsModalRef,
        private produtosService: ProdutosService,
        private translateService: TranslateService,
        private bsModalService: BsModalService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.payload = this.fb.group({
            descriptionLabel: [this.product.descriptionLabel],
            mainDescription: [this.product.mainDescription],
            secondaryDescription: [this.product.secondaryDescription],
            presentation: [this.product.presentation],
            status: [this.product.active],
        });
    }

    get descriptionLabel() {
        return this.payload.get("descriptionLabel");
    }

    get mainDescription() {
        return this.payload.get("mainDescription");
    }

    get secondaryDescription() {
        return this.payload.get("secondaryDescription");
    }

    get presentation() {
        return this.payload.get("presentation");
    }

    get status() {
        return this.payload.get("status");
    }

    public save() {
        const produto: EditarProdutoInputInterface = {
            id: this.product.id,
            descricaoPrincipal: this.mainDescription.value,
            descricaoSecundaria: this.secondaryDescription.value,
            descricaoEtiqueta: this.descriptionLabel.value,
            apresentacao: this.presentation.value,
            ativo: this.status.value,
        };

        this.produtosService.editarProduto(this.product.id, produto).subscribe(
            (httpResponse) => {
                this.productStore.editProduct(this.productStore.transformProductInterfaceUsingProdutoInterface(httpResponse.content));

                this.toastrService.success(this.translateService.instant("INFORMATION_SUCCESSFULLY_CHANGED"));
                this.bsModalRef.hide();
            },
            (httpResponseError) => {
                this.toastrService.error(httpResponseError.message, this.translateService.instant("OOPS_SOMETHING_WENT_WRONG"));
            }
        );
    }

    onClickClose() {
        // Antes de fechar verifica se sofreu alguma alteração no formulário
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
