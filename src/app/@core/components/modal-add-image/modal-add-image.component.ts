import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Dimensions, ImageCroppedEvent, ImageTransform } from "ngx-image-cropper";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { UploadImagemFamiliaInputInterface } from "src/app/@core/interfaces/models/upload-imagem-familia-input.interface";
import { FamiliasService } from "src/app/@core/services/familias.service";

import { FamiliaInterface } from "../../interfaces/entities/familia.interface";
import { ProdutosService } from "../../services/produtos.service";
import { ListImagesEnum } from "../lista-imagens/list-images.enum";
import { ProdutoInterface } from "./../../interfaces/entities/produto.interface";
import { HttpResponseInterface } from "./../../interfaces/http-response.interface";
import { UploadImagemProdutoInputInterface } from "./../../interfaces/models/upload-imagem-produto-input.interface";

@Component({
    selector: "app-modal-add-image",
    templateUrl: "./modal-add-image.component.html",
    styleUrls: ["./modal-add-image.component.scss"],
})
export class ModalAddImageComponent implements OnInit {
    public onSuccess: Function;
    public onCancel: Function;
    public nameImage: string;
    private image: File;
    public width: number;
    public height: number;
    public isUploading: boolean = false;
    public imageChangedEvent: any = "";
    public itemId: number;
    public itemType: string;
    public croppedImage: any = "";
    public canvasRotation = 0;
    private rotation = 0;
    private scale = 1;
    public showCropper = false;
    public containWithinAspectRatio = false;
    public transform: ImageTransform = {};

    constructor(
        public bsModalRef: BsModalRef,
        private familiasService: FamiliasService,
        private produtosService: ProdutosService,
        private toastrService: ToastrService,
        private translateService: TranslateService
    ) {}

    public ngOnInit() {
        this.nameImage = this.imageChangedEvent.name;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.width = event.width;
        this.height = event.height;

        this.image = this.convertToImage(event.base64, this.nameImage);
    }

    private convertToImage(dataurl, filename) {
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    public imageLoaded() {
        this.showCropper = true;
    }

    public cropperReady(sourceImageDimensions: Dimensions) {}

    public loadImageFailed() {}

    public onUpload(bsModalRef: BsModalRef) {
        this.isUploading = true;

        let observable: Observable<HttpResponseInterface<ProdutoInterface | FamiliaInterface>>;
        if (this.itemType === ListImagesEnum.product) {
            let uploadImagem: UploadImagemProdutoInputInterface = {
                produtoId: this.itemId,
                principal: true,
                arquivo: this.image,
            };

            observable = this.produtosService.adicionarImagem(this.itemId, uploadImagem);
        } else {
            let uploadImagem: UploadImagemFamiliaInputInterface = {
                familiaId: this.itemId,
                principal: true,
                arquivo: this.image,
            };

            observable = this.familiasService.adicionarImagem(this.itemId, uploadImagem);
        }

        observable.subscribe(
            (httpResponse) => {
                let newImage = httpResponse.content.imagens.pop();
                this.onSuccess(bsModalRef, newImage);
                this.isUploading = false;
            },
            (httpErrorResponse) => {
                this.isUploading = false;
                this.toastrService.error(
                    httpErrorResponse?.error?.responseMessage,
                    this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                );
            }
        );
    }

    public onClose(bsModalRef: BsModalRef) {
        bsModalRef.hide();
        this.onCancel(bsModalRef);
    }
}
