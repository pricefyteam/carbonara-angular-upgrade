import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthService } from "pricefyfrontlib/app/core/auth/auth.service";
import { CoreModule } from "src/app/@core/core.module";

import { FamiliasModule } from "../familias/familias.module";
import { HttpInterceptorHeadersInterceptor } from "./../../../../pricefyfrontlib/app/core/http-service/http-interceptor-headers.interceptor";
import { NormalizeImagePipe } from "./../../../../pricefyfrontlib/app/shared/pipes/normalize-image.pipe";
import { ProdutosModule } from "./../produtos/produtos.module";
import { BancoImagensRoutingModule } from "./banco-imagens-routing.module";
import { BancoImagensComponent } from "./banco-imagens.component";
import { DetalhesCatalogoProdutoComponent } from "./modals/detalhes-catalogo-produto/detalhes-catalogo-produto.component";
import { DetalhesProdutoFamiliaComponent } from "./modals/detalhes-produto-familia/detalhes-produto-familia.component";
import { ListaImagensComponent } from "./views/lista-imagens/lista-imagens.component";
import { ResultadosComponent } from "./views/resultados/resultados.component";

const VIEWS = [ListaImagensComponent, ResultadosComponent];

const MODALS = [DetalhesProdutoFamiliaComponent, DetalhesCatalogoProdutoComponent];

@NgModule({
    declarations: [BancoImagensComponent, ...VIEWS, ...MODALS],
    imports: [HttpClientModule, CoreModule, CommonModule, BancoImagensRoutingModule, FamiliasModule, ProdutosModule],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorHeadersInterceptor, deps: [AuthService], multi: true },
        NormalizeImagePipe,
    ],
})
export class BancoImagensModule {}
