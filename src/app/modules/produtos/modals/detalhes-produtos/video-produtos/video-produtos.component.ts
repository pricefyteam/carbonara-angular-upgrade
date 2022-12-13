import { __isEmpty } from "pricefyfrontlib/app/shared/helpers/functions";
import { ProductsEffects } from "src/app/@states/products/products.effects";
import { TipoMidiaEnum } from "src/app/@core/interfaces/entities/produto-tipo-midia-enum.interface";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { UploaderOptions, UploadInput } from "ngx-uploader";
import { ConfirmaExclusaoComponent } from "src/app/@core/components/confirma-exclusao/confirma-exclusao.component";
import { HttpErrorResponseInterface } from "src/app/@core/interfaces/http-error-response.interface";
import { ProdutosService } from "src/app/@core/services/produtos.service";
import { ProductsStore } from "src/app/@states/products/products.store";
import { environment } from "src/environments/environment";
import { RemoverMidiaProdutoInputInterface } from "src/app/@core/interfaces/models/remover-midia-produto.interface";
import { Observable } from "rxjs";
import { ProdutoInterface } from "src/app/@core/interfaces/entities/produto.interface";
import { HttpResponseInterface } from "src/app/@core/interfaces/http-response.interface";
import { ProductInterface } from "src/app/@states/@interfaces/product.interface";
import { UploadMidiaProdutoInputInterface } from "src/app/@core/interfaces/models/upload-midia-produto-input.interface";
import { ProductMidiaInterface } from "src/app/@states/@interfaces/product.midia.interface";

@Component({
    selector: "app-video-produtos",
    templateUrl: "./video-produtos.component.html",
    styleUrls: ["./video-produtos.component.scss"],
})
export class VideoProdutosComponent implements OnInit {
    @Input("info") public info: string;
    @Input("itemId") public itemId: string;
    @Input("product") public product: ProductInterface;
    @ViewChild("uploaderCropper") uploaderInput: ElementRef;
    public isHover: boolean = false;
    public options: UploaderOptions = {
        concurrency: 1,
        maxFileSize: environment.maxSizeFile,
    };

    public arquivo: File;
    public form: FormGroup;
    public isValid: boolean = true;
    public uploadInput: EventEmitter<UploadInput>;
    public productId: any = [];
    public midiaInterface$: Observable<ProductMidiaInterface[]>;
    public isLoading = false;
    public isLoadingVideo = false;

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
            videoItem: [""],
        });

        this.productEffects.getMidiaByProductCode({
            productCode: this.product.code,
            tipoMidia: TipoMidiaEnum.Video,
            component: this,
        });

        this.midiaInterface$ = this.productsStore.getMidiasByCode$(this.product.code, TipoMidiaEnum.Video);
    }

    public fileChangeEvent(event: any): void {
        this.sendMidia(event.target.files[0]);
    }

    public onUploadOutput(output): void {
        if (this.uploaderInput.nativeElement.files.length <= environment.maxFileUpload) {
            switch (output.type) {
                case "allAddedToQueue":
                    break;
                case "addedToQueue":
                    if (typeof output.file !== "undefined") {
                        this.sendMidia(output.file.nativeFile);
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

    public sendMidia(file: File) {
        let observable: Observable<HttpResponseInterface<ProdutoInterface>>;
        let uploadVideo: UploadMidiaProdutoInputInterface = {
            produtoId: this.product.id,
            produtoCodigo: this.product.code,
            principal: false,
            arquivo: file,
        };

        observable = this.produtosService.adicionarVideo(this.product.code, uploadVideo);

        this.isLoading = true;

        observable.subscribe(
            (httpResponse) => {
                let newImage = httpResponse.content.midias.pop();

                this.isLoading = true;

                let image: ProductMidiaInterface = {
                    id: newImage.id,
                    productId: newImage.produtoId,
                    product: { code: this.product.code, id: newImage.produtoId, monolitoId: httpResponse.content.monolitoId },
                    type: newImage.tipo,
                    url: newImage.url,
                    urlThumbnail: newImage.urlThumbnail,
                    main: newImage.principal,
                    midiaId: newImage.midiaId,
                };

                this.productsStore.addMidia(image);

                //limpa input de fileUpload para que seja possível fazer um upload novamente, caso o usuário queria
                this.uploaderInput.nativeElement.value = "";

                // Apresenta a mensagem de sucesso
                this.toastrService.success(this.translateService.instant("VIDEO_SAVED_SUCCESSFULLY"));

                this.isLoading = false;
            },
            (httpErrorResponse) => {
                this.toastrService.error(
                    httpErrorResponse?.error?.responseMessage,
                    this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                );
                this.isLoading = false;
            }
        );
    }

    public removeVideo(video: ProductMidiaInterface) {
        let modalRef: BsModalRef = this.bsModalService.show(ConfirmaExclusaoComponent, { class: "confirma-exclusao" });

        modalRef.content.confirmed.subscribe((isConfirmed) => {
            modalRef.hide();
            if (isConfirmed === false) {
                return;
            }

            //faz a remoção visual
            this.productsStore.deleteMidia(video);

            this.isLoadingVideo = true;

            const input: RemoverMidiaProdutoInputInterface = {
                produtoId: video.productId,
                produtoCodigo: video.product.code,
                midiaId: video.id,
            };

            this.produtosService.removeMidia(this.product.code, input).subscribe(
                () => {
                    // Apresenta a mensagem de sucesso
                    this.toastrService.success(this.translateService.instant("VIDEO_SUCCESSFULLY_DELETED"));
                    this.isLoadingVideo = false;
                },
                (httpErrorResponse: HttpErrorResponseInterface) => {
                    //em caso de problemas, retorna para o estado anterior, colocando a imagem de volta
                    // this.productsStore.addMidia({ productCode: this.itemId, banner: ProductMidiaInterface });

                    //mostra mensagem de erro ao usuário, alertando do problema
                    this.toastrService.error(
                        httpErrorResponse.error.responseMessage,
                        this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                    );
                    this.isLoadingVideo = false;
                }
            );
        });
    }
}
