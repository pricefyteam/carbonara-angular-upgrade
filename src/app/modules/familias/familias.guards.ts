import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PesquisarFamiliaInputInterface } from "src/app/@core/interfaces/models/pesquisar-familia-input";
import { FamiliasService } from "src/app/@core/services/familias.service";

@Injectable()
export class ActivateWhenDontHaveFamilies implements CanActivate {
    constructor(private familiasService: FamiliasService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const pesquisa: PesquisarFamiliaInputInterface = {
            texto: "",
            incluirImagens: true,
            incluirProdutos: true,
            incluirImagensProdutos: false,
        };

        return this.familiasService.getFamilias(pesquisa, 1, 1).pipe(
            map((httpResponse) => {
                if (httpResponse.content.itens.length === 0) {
                    return true;
                } else {
                    this.router.navigate(["familias"]);
                    return false;
                }
            })
        );
    }
}

@Injectable()
export class ActivateWhenHaveFamilies implements CanActivate {
    constructor(private familiasService: FamiliasService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const pesquisa: PesquisarFamiliaInputInterface = {
            texto: "",
            incluirImagens: true,
            incluirProdutos: true,
            incluirImagensProdutos: false,
        };

        return this.familiasService.getFamilias(pesquisa, 1, 1).pipe(
            map((httpResponse) => {
                if (httpResponse.content.itens.length >= 1) {
                    return true;
                } else {
                    this.router.navigate(["familias", "sem-familias"]);
                    return false;
                }
            })
        );
    }
}
