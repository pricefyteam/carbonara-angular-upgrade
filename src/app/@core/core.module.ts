import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateService } from "@ngx-translate/core";
import { defineLocale } from "ngx-bootstrap/chronos";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { esLocale, ptBrLocale } from "ngx-bootstrap/locale";
import { BsModalService } from "ngx-bootstrap/modal";
import { ImageCropperModule } from "ngx-image-cropper";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ToastrService } from "ngx-toastr";
import { NgxUploaderModule } from "ngx-uploader";
import { ModalAddImageComponent } from "src/app/@core/components/modal-add-image/modal-add-image.component";
import { ModalAddBannerComponent } from "./components/modal-add-banner/modal-add-banner.component";
import { FamiliasService } from "src/app/@core/services/familias.service";
import { ProdutosService } from "src/app/@core/services/produtos.service";
import { ModalAddBannerFamilyComponent } from "./components/modal-add-banner-family/modal-add-banner-family.component";

import { SharedModule } from "../../../pricefyfrontlib/app/shared/shared.module";
import { StateModule } from "../@states/state.module";
import { ConfirmaExclusaoComponent } from "./components/confirma-exclusao/confirma-exclusao.component";
import { HeaderComponent } from "./components/header/header.component";
import { ImageDescricaoCardComponent } from "./components/image-descricao-card/image-descricao-card.component";
import { ListaImagemComponent } from "./components/lista-imagens/lista-imagens.component";
import { SearchInputComponent } from "./components/search-input/search-input.component";
import { SelectProdutosFamiliasComponent } from "./components/select-produtos-familias/select-produtos-familias.component";
import { SortDirective } from "./directives/sort/sort.directive";
import { NormalizeImagePipe } from "./pipes/normalize-image/normalize-image.pipe";
import { BuscaTextualService } from "./services/busca-textual.service";
import { CatalogoProdutosService } from "./services/catalogo-produtos.service";
import { DateFormatsService } from "./services/date-formats.service";
import { ProvedoresService } from "./services/provedores.service";
import { WebConfigService } from "./services/web-config.service";
import { ClientesService } from "./services/clientes.service";


import { MaterialModule } from '../plugins/material.module';
import { DSModule } from '../plugins/design-system.module';
import { HelpersModules } from '../plugins/helpers.module';

const DECLARATIONS_AND_EXPORTS = [
    SortDirective,
    HeaderComponent,
    NormalizeImagePipe,
    ListaImagemComponent,
    SearchInputComponent,
    ModalAddImageComponent,
    ModalAddBannerComponent,
    ModalAddBannerFamilyComponent,
    ConfirmaExclusaoComponent,
    ImageDescricaoCardComponent,
    SelectProdutosFamiliasComponent,
];

const IMPORTS_AND_EXPORTS = [
    StateModule,
    CommonModule,
    SharedModule,
    NgSelectModule,
    NgxUploaderModule,
    ImageCropperModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MaterialModule, DSModule, HelpersModules,
];

const PROVIDERS = [
    DateFormatsService,
    FamiliasService,
    ProdutosService,
    ProvedoresService,
    WebConfigService,
    DateFormatsService,
    CatalogoProdutosService,
    BuscaTextualService,
    ClientesService,
];

@NgModule({
    imports: [...IMPORTS_AND_EXPORTS],
    exports: [...IMPORTS_AND_EXPORTS, ...DECLARATIONS_AND_EXPORTS],
    declarations: [...DECLARATIONS_AND_EXPORTS],
    providers: [...PROVIDERS],
})
export class CoreModule {
    constructor(
        private translateService: TranslateService,
        private toastrService: ToastrService,
        private bsLocaleService: BsLocaleService,
        private bsModalService: BsModalService
    ) {
        this.defineToastDefaults();
        this.defineModalsDefaults();
        this.defineBsLocate();
    }

    public defineBsLocate() {
        defineLocale("pt", ptBrLocale);
        defineLocale("es", esLocale);

        this.bsLocaleService.use(this.translateService.instant("LANGUAGE_CODE").substring(0, 2));
    }

    public defineToastDefaults() {
        this.toastrService.toastrConfig.timeOut = 5000;
        this.toastrService.toastrConfig.closeButton = true;
        this.toastrService.toastrConfig.tapToDismiss = false;
        this.toastrService.toastrConfig.positionClass = "toast-top-center";
    }

    public defineModalsDefaults() {
        this.bsModalService.config.keyboard = false;
        this.bsModalService.config.backdrop = "static";
        this.bsModalService.config.ignoreBackdropClick = true;
    }
}
