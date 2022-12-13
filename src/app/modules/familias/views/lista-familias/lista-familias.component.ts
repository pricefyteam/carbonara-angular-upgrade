import { Component, OnInit } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { PesquisarFamiliaInputInterface } from "src/app/@core/interfaces/models/pesquisar-familia-input";
import { BuscaTextualService } from "src/app/@core/services/busca-textual.service";
import { FamiliasService } from "src/app/@core/services/familias.service";
import { FamilyInterface } from "src/app/@states/@interfaces/family.interface";
import { environment } from "src/environments/environment";

import { ConfirmaExclusaoComponent } from "./../../../../@core/components/confirma-exclusao/confirma-exclusao.component";
import { HttpErrorResponseInterface } from "./../../../../@core/interfaces/http-error-response.interface";
import { FamiliesEffects } from "./../../../../@states/families/families.effects";
import { FamiliesStore } from "./../../../../@states/families/families.store";
import { DetalhesFamiliasComponent } from "./../../modals/detalhes-familias/detalhes-familias.component";
import { FamiliasManipulacaoComponent } from "./../../modals/familias-manipulacao/familias-manipulacao.component";

@UntilDestroy()
@Component({
    selector: "app-lista-familias",
    templateUrl: "./lista-familias.component.html",
    styleUrls: ["./lista-familias.component.scss"],
})
export class ListaFamiliasComponent implements OnInit {
    public families$: Observable<FamilyInterface[]>;
    public resetForm: boolean = false;
    private maxRegister: number = environment.maxRegister;
    private page: number = 1;
    public isLoading$: Observable<boolean>;
    public hasMoreItems$: Observable<boolean>;

    private pesquisa: PesquisarFamiliaInputInterface = {
        texto: "",
        incluirImagens: true,
        incluirProdutos: true,
        incluirImagensProdutos: false,
    };

    constructor(
        private bsModalService: BsModalService,
        private familiesStore: FamiliesStore,
        private familiesEffects: FamiliesEffects,
        private familiasService: FamiliasService,
        private buscaTextualService: BuscaTextualService,
        private toastrService: ToastrService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.isLoading$ = this.familiesEffects.isLoading$;
        this.hasMoreItems$ = this.familiesEffects.hasMoreItems$;

        this.families$ = this.familiesStore.families$;
        this.searchItems("");
    }

    public searchItems(search: string) {
        this.page = 1;
        this.pesquisa.texto = search;
        this.searchFamilies();
        this.resetForm = false;
    }

    private searchFamilies() {
        this.familiesEffects.getFamiliesByText({
            pesquisaInput: this.pesquisa,
            page: this.page,
            maxRegister: this.maxRegister,
            component: this,
        });

        this.families$ = this.familiesStore.families$;
    }

    public detailFamily(family: FamilyInterface) {
        this.bsModalService.show(DetalhesFamiliasComponent, {
            initialState: {
                familiaCode: family.code,
                familiaMainDescription: family.mainDescription,
                familiaSecondaryDescription: family.secondaryDescription,
            },
        });
    }

    public indexFamily(family: FamilyInterface) {
        this.buscaTextualService.indexItem(family.code, "familia").subscribe(
            () => {
                this.toastrService.success(this.translateService.instant("INDEX_ON_FTS_SUCCESS"));
            },
            (httpResponseError: HttpErrorResponseInterface) => {
                this.toastrService.error(httpResponseError.message, this.translateService.instant("OOPS_SOMETHING_WENT_WRONG"));
            }
        );
    }

    public removeFamily(family: FamilyInterface) {
        let modalRef: BsModalRef = this.bsModalService.show(ConfirmaExclusaoComponent, { class: "confirma-exclusao" });

        modalRef.content.confirmed.subscribe((isConfirmed) => {
            if (isConfirmed === false) {
                return;
            }

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

    public abrirModalFamiliaManipulacao() {
        this.bsModalService.show(FamiliasManipulacaoComponent);
        this.resetForm = true;
    }

    public onScroll(hasMoreItems: boolean) {
        if (hasMoreItems) {
            this.page++;
            this.searchFamilies();
        }
    }
}
