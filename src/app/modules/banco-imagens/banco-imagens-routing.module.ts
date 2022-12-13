import { ResultadosComponent } from "./views/resultados/resultados.component";
import { BancoImagensComponent } from "./banco-imagens.component";
import { ListaImagensComponent } from "./views/lista-imagens/lista-imagens.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProvidersResolver } from "./banco-imagens.resolves";

const routes: Routes = [
    {
        path: "",
        component: BancoImagensComponent,
        children: [
            {
                path: "",
                component: ListaImagensComponent,
                resolve: { provider: ProvidersResolver },
            },
            {
                path: "resultados",
                component: ResultadosComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProvidersResolver],
})
export class BancoImagensRoutingModule {}
