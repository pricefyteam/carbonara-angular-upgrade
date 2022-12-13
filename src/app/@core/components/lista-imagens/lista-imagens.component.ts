import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { UploaderOptions, UploadInput } from "ngx-uploader";
import { ModalAddImageComponent } from "src/app/@core/components/modal-add-image/modal-add-image.component";
import { FamiliasService } from "src/app/@core/services/familias.service";
import { environment } from "src/environments/environment";

import { ProdutosService } from "../../services/produtos.service";
import { ProductFamilyImageInterface } from "./../../../@states/@interfaces/product-family-image.interface";
import { FamiliesStore } from "./../../../@states/families/families.store";
import { ProductsStore } from "./../../../@states/products/products.store";
import { HttpErrorResponseInterface } from "./../../interfaces/http-error-response.interface";
import { RemoverImagemFamiliaInputInterface } from "./../../interfaces/models/remover-imagem-familia-input.interface";
import { RemoverImagemProdutoInputInterface } from "./../../interfaces/models/remover-imagem-produto-input.interface";
import { ConfirmaExclusaoComponent } from "./../confirma-exclusao/confirma-exclusao.component";
import { ListImagesEnum } from "./list-images.enum";

@Component({
    selector: "cmp-lista-imagens",
    templateUrl: "./lista-imagens.component.html",
    styleUrls: ["./lista-imagens.component.scss"],
})
export class ListaImagemComponent implements OnInit {
    @Input("images") public images: ProductFamilyImageInterface[];
    @Input("itemId") public itemId: number;
    @Input("info") public info: string;
    @Input("typeItem") public typeItem: ListImagesEnum;
    @ViewChild("uploaderCropper") uploaderInput: ElementRef;
    public isHover: boolean = false;
    public options: UploaderOptions = {
        concurrency: 1,
        maxFileSize: environment.maxSizeFile,
    };
    public form: FormGroup;
    public isValid: boolean = true;
    public uploadInput: EventEmitter<UploadInput>;

    constructor(
        private bsModalService: BsModalService,
        private fb: FormBuilder,
        private familiesStore: FamiliesStore,
        private familiasService: FamiliasService,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private productsStore: ProductsStore,
        private produtosService: ProdutosService
    ) {}

    ngOnInit(): void {}

    ngOnChanges() {
        this.form = this.fb.group({
            imageItem: [""],
        });

        this.selectMainImage();
    }

    get imageItem() {
        return this.form.get("imageItem");
    }

    private selectMainImage() {
        const mainImage = this.images.find((image) => image.main === true);
        if (mainImage !== undefined) {
            this.imageItem.setValue(mainImage);
        }
    }

    public onUploadOutput(output): void {
        if (this.uploaderInput.nativeElement.files.length <= environment.maxFileUpload) {
            switch (output.type) {
                case "allAddedToQueue":
                    break;
                case "addedToQueue":
                    if (typeof output.file !== "undefined") {
                        this.openModalAddImage(output.file.nativeFile);
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

    public fileChangeEvent(event: any): void {
        this.openModalAddImage(event.target.files[0]);
    }

    private openModalAddImage(file: File) {
        this.bsModalService.show(ModalAddImageComponent, {
            class: "modal-add-image",
            initialState: {
                imageChangedEvent: file,
                itemId: this.itemId,
                itemType: this.typeItem,
                onSuccess: (bsModalRef: BsModalRef, newImage: any) => {
                    if (this.typeItem === ListImagesEnum.product) {
                        // insere a nova imagem no store
                        this.productsStore.addImageProduct({
                            productId: this.itemId,
                            image: this.familiesStore.transformFamilyImageInterfaceUsingProductFamilyImageInterface(newImage),
                        });
                    } else {
                        // insere a nova imagem no store
                        this.familiesStore.addImageFamily({
                            familyId: this.itemId,
                            image: this.familiesStore.transformFamilyImageInterfaceUsingProductFamilyImageInterface(newImage),
                        });
                    }

                    this.selectMainImage();

                    //limpa input de fileUpload para que seja possível fazer um upload novamente, caso o usuário queria
                    this.uploaderInput.nativeElement.value = "";

                    // Apresenta a mensagem de sucesso
                    this.toastrService.success(this.translateService.instant("IMAGE_SAVED_SUCCESSFULLY"));

                    //fecha a modal de adicionar imagem
                    bsModalRef.hide();
                },
                onCancel: (bsModalRef: BsModalRef) => {
                    this.uploaderInput.nativeElement.value = "";
                    bsModalRef.hide();
                },
            },
        });
    }

    public removeImage(image: ProductFamilyImageInterface) {
        let modalRef: BsModalRef = this.bsModalService.show(ConfirmaExclusaoComponent, { class: "confirma-exclusao" });

        modalRef.content.confirmed.subscribe((isConfirmed) => {
            modalRef.hide();
            if (isConfirmed === false) {
                return;
            }

            if (this.typeItem === ListImagesEnum.product) {
                //faz a remoção visual
                this.productsStore.deleteImageProducts({ productId: this.itemId, image: image });

                const input: RemoverImagemProdutoInputInterface = {
                    produtoId: this.itemId,
                    produtoImagemId: image.id,
                };

                this.produtosService.removeImagem(this.itemId, input).subscribe(
                    () => {
                        // Apresenta a mensagem de sucesso
                        this.toastrService.success(this.translateService.instant("IMAGE_SUCCESSFULLY_DELETED"));
                    },
                    (httpErrorResponse: HttpErrorResponseInterface) => {
                        //em caso de problemas, retorna para o estado anterior, colocando a imagem de volta
                        this.productsStore.addImageProduct({ productId: this.itemId, image: image });

                        //mostra mensagem de erro ao usuário, alertando do problema
                        this.toastrService.error(
                            httpErrorResponse.error.responseMessage,
                            this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                        );
                    }
                );
            } else {
                //faz a remoção visual
                this.familiesStore.deleteImageFamily({ familyId: this.itemId, image: image });

                const input: RemoverImagemFamiliaInputInterface = {
                    familiaId: this.itemId,
                    familiaImagemId: image.id,
                };

                this.familiasService.removeImagem(this.itemId, input).subscribe(
                    () => {
                        // Apresenta a mensagem de sucesso
                        this.toastrService.success(this.translateService.instant("IMAGE_SUCCESSFULLY_DELETED"));
                    },
                    (httpErrorResponse: HttpErrorResponseInterface) => {
                        //em caso de problemas, retorna para o estado anterior, colocando a imagem de volta
                        this.familiesStore.addImageFamily({ familyId: this.itemId, image: image });

                        //mostra mensagem de erro ao usuário, alertando do problema
                        this.toastrService.error(
                            httpErrorResponse.error.responseMessage,
                            this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                        );
                    }
                );
            }
        });
    }

    public setImageMain(image: ProductFamilyImageInterface) {
        image.main = true;

        if (this.typeItem === ListImagesEnum.product) {
            this.produtosService.setImagemPrincipal(this.itemId, image).subscribe(
                () => {
                    this.productsStore.updateMainImageProduct({ productId: this.itemId, image: image });
                    this.imageItem.setValue(image);

                    this.toastrService.success(this.translateService.instant("IMAGE_SAVED_SUCCESSFULLY"));
                },
                (httpErrorResponse: HttpErrorResponseInterface) => {
                    this.toastrService.error(
                        httpErrorResponse.error.responseMessage,
                        this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                    );
                }
            );
        } else {
            this.familiasService.setImagemPrincipal(image).subscribe(
                () => {
                    this.familiesStore.updateMainImageFamily({ familyId: image.familyId, image: image });
                    this.imageItem.setValue(image);

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
}
