import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { UploaderOptions, UploadInput } from "ngx-uploader";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfirmaExclusaoComponent } from "src/app/@core/components/confirma-exclusao/confirma-exclusao.component";
import { ModalAddBannerFamilyComponent } from "src/app/@core/components/modal-add-banner-family/modal-add-banner-family.component";
import { ModalAddBannerComponent } from "src/app/@core/components/modal-add-banner/modal-add-banner.component";
import { FamiliaMidiaInterface } from "src/app/@core/interfaces/entities/familia-midia.interface";
import { TipoMidiaFamiliaEnum } from "src/app/@core/interfaces/entities/familia-tipo-midia-enum.interface";
import { ProdutoMidiaInterface } from "src/app/@core/interfaces/entities/produto-midia.interface";
import { TipoMidiaEnum } from "src/app/@core/interfaces/entities/produto-tipo-midia-enum.interface";
import { HttpErrorResponseInterface } from "src/app/@core/interfaces/http-error-response.interface";
import { RemoverMidiaFamiliaInputInterface } from "src/app/@core/interfaces/models/remover-midia-familia.interface";
import { RemoverMidiaProdutoInputInterface } from "src/app/@core/interfaces/models/remover-midia-produto.interface";
import { FamiliasService } from "src/app/@core/services/familias.service";
import { ProdutosService } from "src/app/@core/services/produtos.service";
import { FamilyInterface } from "src/app/@states/@interfaces/family.interface";
import { FamilyMidiaInterface } from "src/app/@states/@interfaces/family.midia.interface";
import { ProductInterface } from "src/app/@states/@interfaces/product.interface";
import { ProductMidiaInterface } from "src/app/@states/@interfaces/product.midia.interface";
import { FamiliesEffects } from "src/app/@states/families/families.effects";
import { FamiliesStore } from "src/app/@states/families/families.store";
import { ProductsEffects } from "src/app/@states/products/products.effects";
import { ProductsStore } from "src/app/@states/products/products.store";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-banner-familia",
    templateUrl: "./banner-familia.component.html",
    styleUrls: ["./banner-familia.component.scss"],
})
export class BannerFamiliaComponent implements OnInit {
    @Input("info") public info: string;
    @Input("itemId") public itemId: string;
    @Input("family") public family: FamilyInterface;
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
    public midiaFamilyInterface$: Observable<FamilyMidiaInterface[]>;
    public isLoading = false;

    constructor(
        public bsModalRef: BsModalRef,
        private translateService: TranslateService,
        private toastrService: ToastrService,
        private fb: FormBuilder,
        private familiasService: FamiliasService,
        private familiesStore: FamiliesStore,
        private bsModalService: BsModalService,
        private familiesEffects: FamiliesEffects
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            imageItem: [""],
        });

        this.familiesEffects.getMidiaByFamilyCode({
            familyCode: this.family.code,
            tipoMidia: TipoMidiaFamiliaEnum.Banner,
            component: this,
        });

        this.midiaFamilyInterface$ = this.familiesStore.getMidiasFamilyByCode$(this.family.code, TipoMidiaFamiliaEnum.Banner).pipe(
            map((midias) => {
                const mainMidia = this.family.midias.find((image) => image.main === true);
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
        this.openModalAddBannerFamily(event.target.files[0]);
    }

    public onUploadOutput(output): void {
        if (this.uploaderInput.nativeElement.files.length <= environment.maxFileUpload) {
            switch (output.type) {
                case "allAddedToQueue":
                    break;
                case "addedToQueue":
                    if (typeof output.file !== "undefined") {
                        this.openModalAddBannerFamily(output.file.nativeFile);
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

    public openModalAddBannerFamily(file: File) {
        this.bsModalService.show(ModalAddBannerFamilyComponent, {
            class: "modal-add-banner",
            initialState: {
                imageChangedEvent: file,
                productCode: this.family.code,
                onSuccess: (bsModalRef: BsModalRef, newImage: FamilyMidiaInterface) => {
                    // insere a nova imagem no store
                    this.familiesStore.addMidiaFamily(newImage);

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

    public removeBanner(banner: FamilyMidiaInterface) {
        let modalRef: BsModalRef = this.bsModalService.show(ConfirmaExclusaoComponent, { class: "confirma-exclusao" });

        modalRef.content.confirmed.subscribe((isConfirmed) => {
            modalRef.hide();
            if (isConfirmed === false) {
                return;
            }

            //faz a remoção visual
            this.familiesStore.deleteMidiaFamily(banner);

            this.isLoading = true;

            const input: RemoverMidiaFamiliaInputInterface = {
                familiaId: banner.familyId,
                familiaCodigo: banner.family.code,
                midiaId: banner.id,
            };

            this.familiasService.removeMidia(this.family.code, input).subscribe(
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

    public setMidiaMain(midia: FamiliaMidiaInterface) {
        midia.principal = true;

        this.familiasService.setBannerFamiliaPrincipal(this.family.code, midia.id, midia).subscribe(
            () => {
                this.familiesStore.updateMainMidiaFamily({ familyCode: this.family.code, midia: midia });
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
