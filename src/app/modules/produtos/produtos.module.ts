import { ConfirmaSairComponent } from "./modals/confirma-sair/confirma-sair.component";
import { DetalhesProdutosComponent } from "./modals/detalhes-produtos/detalhes-produtos.component";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "pricefyfrontlib/app/core/auth/auth.service";
import { HttpInterceptorHeadersInterceptor } from "./../../../../pricefyfrontlib/app/core/http-service/http-interceptor-headers.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ListaProdutosComponent } from "./views/lista-produtos/lista-produtos.component";
import { SemProdutosComponent } from "./views/sem-produtos/sem-produtos.component";
import { ProdutosComponent } from "./produtos.component";
import { ProdutosRoutingModule } from "./produtos-routing.module";
import { CoreModule } from "src/app/@core/core.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "./modals/detalhes-produtos/banner/banner.component";
import { EditarProdutoComponent } from "./modals/editar-produto/editar-produto.component";
import { EditarInfoComponent } from "./modals/editar-info/editar-info.component";
import { DetalhesProdutosInformacoesComponent } from "./modals/detalhes-produtos/detalhes-produtos-informacoes/detalhes-produtos-informacoes.component";
import { CardInformacoesComponent } from "./modals/detalhes-produtos/detalhes-produtos-informacoes/card-informacoes/card-informacoes.component";
import { VideoProdutosComponent } from "./modals/detalhes-produtos/video-produtos/video-produtos.component";

const VIEWS = [SemProdutosComponent, ListaProdutosComponent];

const MODALS = [
    DetalhesProdutosComponent,
    DetalhesProdutosInformacoesComponent,
    CardInformacoesComponent,
    ConfirmaSairComponent,
    EditarProdutoComponent,
    EditarInfoComponent,
    BannerComponent,
    VideoProdutosComponent,
];

@NgModule({
    declarations: [ProdutosComponent, ...VIEWS, ...MODALS],
    imports: [HttpClientModule, CoreModule, CommonModule, ProdutosRoutingModule],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorHeadersInterceptor, deps: [AuthService], multi: true }],
})
export class ProdutosModule {}
