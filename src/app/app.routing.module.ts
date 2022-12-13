import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenuService } from "pricefyfrontlib/app/core/menu/menu.service";

import { AuthGuardService } from "../../pricefyfrontlib/app/core/auth/auth-guard.service";
import { LayoutComponent } from "../../pricefyfrontlib/app/layout/layout.component";
import { AppMenus } from "./app.menus";
import { HomeComponent } from "./modules/pages/home/home.component";

const routes: Routes = [
    {
        path: "",
        data: { role: "MN-GERENCIAMENTO-PIM" },
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: "",
                component: HomeComponent,
            },
        ],
    },
    {
        path: "banco-de-imagens",
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: "",
                data: { role: "MN-GERENCIAMENTO-PIM" },
                loadChildren: () => import("./modules/banco-imagens/banco-imagens.module").then((module) => module.BancoImagensModule),
            },
        ],
    },
    {
        path: "familias",
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: "",
                data: { role: "MN-GERENCIAMENTO-PIM" },
                loadChildren: () => import("./modules/familias/familias.module").then((module) => module.FamiliasModule),
            },
        ],
    },
    {
        path: "produtos",
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: "",
                data: { role: "MN-GERENCIAMENTO-PIM" },
                loadChildren: () => import("./modules/produtos/produtos.module").then((module) => module.ProdutosModule),
            },
        ],
    },
    { path: "**", redirectTo: "notfound" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {
    constructor(private menuService: MenuService) {
        this.menuService.generateMenu(AppMenus.menus());
    }
}