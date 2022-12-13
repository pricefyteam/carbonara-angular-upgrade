import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ISuperCardTabs, SuperCardOptions } from "pricefyfrontlib/app/shared/components/super-card/super-card.interfaces";
import { Observable } from "rxjs";
import { __getThumbnailURLFromImages } from "src/app/@core/helpers/functions";
import { AdicionarProdutosComponent } from "../adicionar-produtos/adicionar-produtos.component";
import { EditarInformacoesComponent } from "../editar-informacoes/editar-informacoes.component";

import { ConfirmaExclusaoComponent } from "./../../../../@core/components/confirma-exclusao/confirma-exclusao.component";
import { ListImagesEnum } from "./../../../../@core/components/lista-imagens/list-images.enum";
import { HttpErrorResponseInterface } from "./../../../../@core/interfaces/http-error-response.interface";
import { FamiliasService } from "./../../../../@core/services/familias.service";
import { FamilyInterface } from "./../../../../@states/@interfaces/family.interface";
import { FamiliesEffects } from "./../../../../@states/families/families.effects";
import { FamiliesStore } from "./../../../../@states/families/families.store";
import { FamiliasManipulacaoComponent } from "./../../modals/familias-manipulacao/familias-manipulacao.component";
import { first } from "rxjs/operators";

@Component({
    selector: "app-detalhes-familias",
    templateUrl: "./detalhes-familias.component.html",
    styleUrls: ["./detalhes-familias.component.scss"],
})
export class DetalhesFamiliasComponent implements OnInit {
    public familiaCode: string;
    public familiaMainDescription: string;
    public familiaSecondaryDescription: string;
    public family$: Observable<FamilyInterface>;
    public family: FamilyInterface;
    public processing: boolean = false;
    public listImagesEnum: typeof ListImagesEnum = ListImagesEnum;
    public destinationCode = "desc";
    public destinationDescription = "desc";
    public activeTab: ISuperCardTabs;

    public superCardFamilyOptions = new SuperCardOptions();

    constructor(
        private bsModalService: BsModalService,
        public bsModalRef: BsModalRef,
        private familiesStore: FamiliesStore,
        private familiesEffects: FamiliesEffects,
        private familiasService: FamiliasService,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private router: Router
    ) {
        this.configSuperCardFamily();
    }

    ngOnInit(): void {
        this.family$ = this.familiesStore.byCode$(this.familiaCode);
        this.familiesEffects.getFamilyByCode({
            code: this.familiaCode,
            incluirImagens: true,
            incluirProdutos: true,
            incluirImagensProduto: true,
            component: this,
        });
        this.family$.pipe(first()).subscribe((familia) => {
            this.superCardFamilyOptions.title = familia.mainDescription + " " + familia.secondaryDescription;
        });
    }

    configSuperCardFamily() {
        this.superCardFamilyOptions.widgetId = "superCardFamilies";
        this.superCardFamilyOptions.tabs = [
            <ISuperCardTabs>{
                description: this.translateService.instant("MAIN"),
                tabOrder: 0,
                widgetId: "principal",
                icon: "bi bi-upc",
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

        this.superCardFamilyOptions.selectTab = ($event: any) => (this.activeTab = $event);
        this.superCardFamilyOptions.onClose = ($event: any) => this.onCloseSuperCard($event);
        this.activeTab = this.superCardFamilyOptions.tabs[0];
    }

    public editInformation(familyId: number) {
        this.bsModalService.show(EditarInformacoesComponent, {
            initialState: {
                editingFamilyId: familyId,
            },
        });
    }

    public addProducts(familyId: number) {
        this.bsModalService.show(AdicionarProdutosComponent, {
            initialState: {
                editingFamilyId: familyId,
            },
        });
    }

    public removeFamily(family: FamilyInterface) {
        let modalRef: BsModalRef = this.bsModalService.show(ConfirmaExclusaoComponent, { class: "confirma-exclusao" });

        modalRef.content.confirmed.subscribe((isConfirmed) => {
            // Remove a modal de confirmação
            modalRef.hide();
            if (isConfirmed === false) {
                return;
            }

            // Remove a modal de detalhes de família
            this.bsModalRef.hide();

            //faz a remoção visual
            this.familiesStore.deleteFamily(family.id);

            this.familiasService.removerFamilia(family.id).subscribe(
                () => {
                    this.toastrService.success(this.translateService.instant("FAMILY_SUCCESSFULLY_DELETED"));
                },
                (httpErrorResponse: HttpErrorResponseInterface) => {
                    //em caso de problemas, retorna para o estado anterior, colocando a família de volta
                    this.familiesStore.addFamily(family);

                    //mostra mensagem de erro ao usuário, alertando do problema
                    this.toastrService.error(
                        httpErrorResponse.error.responseMessage,
                        this.translateService.instant("OOPS_SOMETHING_WENT_WRONG")
                    );
                }
            );
        });
    }

    public getThumbnailURL(imagens) {
        return __getThumbnailURLFromImages(imagens);
    }

    private onCloseSuperCard($event: any) {
        this.bsModalRef.hide();
    }
}
