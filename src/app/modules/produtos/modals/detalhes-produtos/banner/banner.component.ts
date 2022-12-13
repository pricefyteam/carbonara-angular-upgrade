import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { UploaderOptions, UploadInput } from "ngx-uploader";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfirmaExclusaoComponent } from "src/app/@core/components/confirma-exclusao/confirma-exclusao.component";
import { ModalAddBannerComponent } from "src/app/@core/components/modal-add-banner/modal-add-banner.component";
import { ProdutoMidiaInterface } from "src/app/@core/interfaces/entities/produto-midia.interface";
import { TipoMidiaEnum } from "src/app/@core/interfaces/entities/produto-tipo-midia-enum.interface";
import { HttpErrorResponseInterface } from "src/app/@core/interfaces/http-error-response.interface";
import { RemoverMidiaProdutoInputInterface } from "src/app/@core/interfaces/models/remover-midia-produto.interface";
import { ProdutosService } from "src/app/@core/services/produtos.service";
import { ProductInterface } from "src/app/@states/@interfaces/product.interface";
import { ProductMidiaInterface } from "src/app/@states/@interfaces/product.midia.interface";
import { ProductsEffects } from "src/app/@states/products/products.effects";
import { ProductsStore } from "src/app/@states/products/products.store";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-banner",
    templateUrl: "./banner.component.html",
    styleUrls: ["./banner.component.scss"],
})
export class BannerComponent implements OnInit {
    @Input("info") public info: string;
    @Input("itemId") public itemId: string;
    @Input("product") public product: ProductInterface;
    @ViewChild("uploaderCropper") uploaderInput: ElementRef;
    public isHover: boolean = false;
    public options: UploaderOptions = {
        concurrency: 1,
        maxFileSize: environment.maxSizeFile,
    };

    public form: FormGroup;
    public isValid: boolean = true;
    public uploadInput: EventEmitter<UploadInput>;
    public response: any = [];
    public productId: any = [];
    public midiaInterface$: Observable<ProductMidiaInterface[]>;
    public isLoading = false;

    constructor(
        private bsModalService: BsModalService,
        private fb: FormBuilder,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private productsStore: ProductsStore,
        private productEffects: ProductsEffects,
        private produtosService: ProdutosService
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            imageItem: [""],
        });

        this.productEffects.getMidiaByProductCode({
            productCode: this.product.code,
            tipoMidia: TipoMidiaEnum.Banner,
            component: this,
        });

        this.midiaInterface$ = this.productsStore.getMidiasByCode$(this.product.code, TipoMidiaEnum.Banner).pipe(
            map((midias) => {
                const mainMidia = this.product.midias.find((image) => image.main === true);
                if (mainMidia) {
                    this.imageItem.setValue(mainMidia);
                }
                return midias;
            })
        );
    }

    get imageItem() {
        return this.form.get("imageItem");
    }

    public fileChangeEvent(event: any): void {
        this.openModalAddBanner(event.target.files[0]);
    }

    public onUploadOutput(output): void {
        if (this.uploaderInput.nativeElement.files.length <= environment.maxFileUpload) {
            switch (output.type) {
                case "allAddedToQueue":
                    break;
                case "addedToQueue":
                    if (typeof output.file !== "undefined") {
                        this.openModalAddBanner(output.file.nativeFile);
                        this.uploaderInput.nativeElement.value = "";
                    }
                    this.isHover = false;
                    break;
                case "dragOver":
                    this.isHover = true;
                    break;
                case "dragOut":
                    this.isHover = false;
                    break;
                case "rejected":
                    this.isHover = false;
                    break;
            }
        }
    }

    public openModalAddBanner(file: File) {
        this.bsModalService.show(ModalAddBannerComponent, {
            class: "modal-add-banner",
            initialState: {
                imageChangedEvent: file,
                productCode: this.product.code,
                onSuccess: (bsModalRef: BsModalRef, newImage: ProductMidiaInterface) => {
                    // insere a nova imagem no store
                    this.productsStore.addMidia(newImage);

                    //limpa input de fileUpload para que seja possível fazer um upload novamente, caso o usuário queria
                    this.uploaderInput.nativeElement.value = "";

                    // Apresenta a mensagem de sucesso
                    this.toastrService.success(this.translateService.instant("IMAGE_SAVED_SUCCESSFULLY"));

                    //fecha a modal de adicionar imagem
                    bsModalRef.hide();
                },
                onCancel: (bsModalRef: BsModalRef) => {
                    bsModalRef.hide();
                },
            },
        });
    }

    public removeBanner(banner: ProductMidiaInterface) {
        let modalRef: BsModalRef = this.bsModalService.show(ConfirmaExclusaoComponent, { class: "confirma-exclusao" });

        modalRef.content.confirmed.subscribe((isConfirmed) => {
            modalRef.hide();
            if (isConfirmed === false) {
                return;
            }

            //faz a remoção visual
            this.productsStore.deleteMidia(banner);

            this.isLoading = true;

            const input: RemoverMidiaProdutoInputInterface = {
                produtoId: banner.productId,
                produtoCodigo: banner.product.code,
                midiaId: banner.id,
            };

            this.produtosService.removeMidia(this.product.code, input).subscribe(
                () => {
                    // Apresenta a mensagem de sucesso
                    this.toastrService.success(this.translateService.instant("IMAGE_SUCCESSFULLY_DELETED"));
                    this.isLoading = false;
                },
                (httpErrorResponse: HttpErrorResponseInterface) => {
                    //em caso de problemas, retorna para o estado anterior, colocando a imagem de volta
                    // this.productsStore.addMidia({ productCode: this.itemId, banner: ProductMidiaInterface });

                    //mostra mensagem de erro ao usuário, alertando do problema
                    this.toastrService.error(
                        httpErrorResponse.error.responseMessage,
                        this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                    );
                    this.isLoading = false;
                }
            );
        });
    }

    public setMidiaMain(midia: ProdutoMidiaInterface) {
        midia.principal = true;

        this.produtosService.setBannerPrincipal(this.product.code, midia.id, midia).subscribe(
            () => {
                this.productsStore.updateMainMidiaProduct({ productCode: this.product.code, midia: midia });
                this.imageItem.setValue(midia);

                this.toastrService.success(this.translateService.instant("IMAGE_SAVED_SUCCESSFULLY"));
            },
            (httpErrorResponse: HttpErrorResponseInterface) => {
                this.toastrService.error(
                    httpErrorResponse.error.responseMessage,
                    this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                );
            }
        );
    }
}
