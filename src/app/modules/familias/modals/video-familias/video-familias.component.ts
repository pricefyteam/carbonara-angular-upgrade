import { __isEmpty } from "pricefyfrontlib/app/shared/helpers/functions";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { UploaderOptions, UploadInput } from "ngx-uploader";
import { ConfirmaExclusaoComponent } from "src/app/@core/components/confirma-exclusao/confirma-exclusao.component";
import { HttpErrorResponseInterface } from "src/app/@core/interfaces/http-error-response.interface";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { HttpResponseInterface } from "src/app/@core/interfaces/http-response.interface";
import { FamilyInterface } from "src/app/@states/@interfaces/family.interface";
import { FamiliesStore } from "src/app/@states/families/families.store";
import { FamilyMidiaInterface } from "src/app/@states/@interfaces/family.midia.interface";
import { TipoMidiaFamiliaEnum } from "src/app/@core/interfaces/entities/familia-tipo-midia-enum.interface";
import { FamiliesEffects } from "src/app/@states/families/families.effects";
import { FamiliaInterface } from "src/app/@core/interfaces/entities/familia.interface";
import { UploadMidiaFamiliaInputInterface } from "src/app/@core/interfaces/models/upload-midia-familia-input.interface";
import { FamiliasService } from "src/app/@core/services/familias.service";
import { RemoverMidiaFamiliaInputInterface } from "src/app/@core/interfaces/models/remover-midia-familia.interface";

@Component({
    selector: "app-video-familias",
    templateUrl: "./video-familias.component.html",
    styleUrls: ["./video-familias.component.scss"],
})
export class VideoFamiliasComponent implements OnInit {
    @Input("info") public info: string;
    @Input("family") public family: FamilyInterface;
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
    public midiaFamilyInterface$: Observable<FamilyMidiaInterface[]>;
    public isLoading = false;
    public isLoadingVideo = false;

    constructor(
        private bsModalService: BsModalService,
        private fb: FormBuilder,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private familiasService: FamiliasService,
        private familiesStore: FamiliesStore,
        private familiesEffects: FamiliesEffects
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            videoItem: [""],
        });

        this.familiesEffects.getMidiaByFamilyCode({
            familyCode: this.family.code,
            tipoMidia: TipoMidiaFamiliaEnum.Video,
            component: this,
        });

        this.midiaFamilyInterface$ = this.familiesStore.getMidiasFamilyByCode$(this.family.code, TipoMidiaFamiliaEnum.Video);
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
        let observable: Observable<HttpResponseInterface<FamiliaInterface>>;
        let uploadVideo: UploadMidiaFamiliaInputInterface = {
            familiaId: this.family.id,
            familiaCodigo: this.family.code,
            principal: true,
            arquivo: file,
        };

        observable = this.familiasService.adicionarVideo(this.family.code, uploadVideo);

        this.isLoading = true;

        observable.subscribe(
            (httpResponse) => {
                let newImage = httpResponse.content.midias.pop();

                this.isLoading = true;

                let image: FamilyMidiaInterface = {
                    id: newImage.id,
                    familyId: newImage.familiaId,
                    family: { code: this.family.code, id: newImage.familiaId, monolitoId: httpResponse.content.monolitoId },
                    type: newImage.tipo,
                    url: newImage.url,
                    urlThumbnail: newImage.urlThumbnail,
                    main: newImage.principal,
                    midiaId: newImage.midiaId,
                };

                this.familiesStore.addMidiaFamily(image);

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

    public removeVideo(video: FamilyMidiaInterface) {
        let modalRef: BsModalRef = this.bsModalService.show(ConfirmaExclusaoComponent, { class: "confirma-exclusao" });

        modalRef.content.confirmed.subscribe((isConfirmed) => {
            modalRef.hide();
            if (isConfirmed === false) {
                return;
            }

            //faz a remoção visual
            this.familiesStore.deleteMidiaFamily(video);

            this.isLoadingVideo = true;

            const input: RemoverMidiaFamiliaInputInterface = {
                familiaId: video.familyId,
                familiaCodigo: video.family.code,
                midiaId: video.id,
            };

            this.familiasService.removeMidia(this.family.code, input).subscribe(
                () => {
                    // Apresenta a mensagem de sucesso
                    this.toastrService.success(this.translateService.instant("VIDEO_SUCCESSFULLY_DELETED"));
                    this.isLoadingVideo = false;
                },
                (httpErrorResponse: HttpErrorResponseInterface) => {
                    //em caso de problemas, retorna para o estado anterior, colocando a imagem de volta
                    // this.familiesStore.addMidiaFamily({ productCode: this.itemId, banner: ProductMidiaInterface });

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
