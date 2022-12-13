import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FamiliasComponent } from "./familias.component";
import { ActivateWhenDontHaveFamilies, ActivateWhenHaveFamilies } from "./familias.guards";
import { ListaFamiliasComponent } from "./views/lista-familias/lista-familias.component";
import { SemFamiliasComponent } from "./views/sem-familias/sem-familias.component";

const routes: Routes = [
    {
        path: "",
        component: FamiliasComponent,
        children: [
            {
                path: "",
                component: ListaFamiliasComponent,
                canActivate: [ActivateWhenHaveFamilies],
            },
            {
                path: "sem-familias",
                component: SemFamiliasComponent,
                canActivate: [ActivateWhenDontHaveFamilies],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ActivateWhenHaveFamilies, ActivateWhenDontHaveFamilies],
})
export class FamiliasRoutingModule {}
