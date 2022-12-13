import { EditarInformacoesComponent } from "./modals/editar-informacoes/editar-informacoes.component";
import { AdicionarProdutosComponent } from "./modals/adicionar-produtos/adicionar-produtos.component";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CoreModule } from "src/app/@core/core.module";

import { AuthService } from "./../../../../pricefyfrontlib/app/core/auth/auth.service";
import { HttpInterceptorHeadersInterceptor } from "./../../../../pricefyfrontlib/app/core/http-service/http-interceptor-headers.interceptor";
import { FamiliasRoutingModule } from "./familias-routing.module";
import { FamiliasComponent } from "./familias.component";
import { DetalhesFamiliasComponent } from "./modals/detalhes-familias/detalhes-familias.component";
import { FamiliasManipulacaoComponent } from "./modals/familias-manipulacao/familias-manipulacao.component";
import { ListaFamiliasComponent } from "./views/lista-familias/lista-familias.component";
import { SemFamiliasComponent } from "./views/sem-familias/sem-familias.component";
import { BannerFamiliaComponent } from "./modals/banner-familia/banner-familia.component";
import { VideoFamiliasComponent } from "./modals/video-familias/video-familias.component";

const VIEWS = [SemFamiliasComponent, ListaFamiliasComponent];

const MODALS = [
    DetalhesFamiliasComponent,
    FamiliasManipulacaoComponent,
    AdicionarProdutosComponent,
    EditarInformacoesComponent,
    BannerFamiliaComponent,
    VideoFamiliasComponent,
];

@NgModule({
    declarations: [FamiliasComponent, ...VIEWS, ...MODALS],
    imports: [HttpClientModule, CoreModule, CommonModule, FamiliasRoutingModule],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorHeadersInterceptor, deps: [AuthService], multi: true }],
})
export class FamiliasModule {}
