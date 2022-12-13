import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ProdutosComponent } from "./produtos.component";
import { ActivateWhenDontHaveProducts, ActivateWhenHaveProducts } from "./produtos.guards";
import { ListaProdutosComponent } from "./views/lista-produtos/lista-produtos.component";
import { SemProdutosComponent } from "./views/sem-produtos/sem-produtos.component";

const routes: Routes = [
    {
        path: "",
        component: ProdutosComponent,
        children: [
            {
                path: "",
                component: ListaProdutosComponent,
                canActivate: [ActivateWhenHaveProducts],
            },
            {
                path: "sem-produtos",
                component: SemProdutosComponent,
                canActivate: [ActivateWhenDontHaveProducts],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ActivateWhenHaveProducts, ActivateWhenDontHaveProducts],
})
export class ProdutosRoutingModule {}
