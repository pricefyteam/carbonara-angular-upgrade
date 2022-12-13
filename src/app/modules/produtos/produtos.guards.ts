import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ProdutosService } from "src/app/@core/services/produtos.service";
import { PesquisarProdutoInputInterface } from "../../@core/interfaces/models/pesquisar-produto-input.interface";

@Injectable()
export class ActivateWhenDontHaveProducts implements CanActivate {
    constructor(private produtosService: ProdutosService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const pesquisa: PesquisarProdutoInputInterface = {
            texto: "",
            ativos: true,
            incluirImagens: true,
            incluirFamilias: false,
        };

        return this.produtosService.getProdutos(pesquisa, 1, 1).pipe(
            map((httpResponse) => {
                if (httpResponse.content.itens.length === 0) {
                    return true;
                } else {
                    this.router.navigate(["produtos"]);
                    return false;
                }
            })
        );
    }
}

@Injectable()
export class ActivateWhenHaveProducts implements CanActivate {
    constructor(private produtosService: ProdutosService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const pesquisa: PesquisarProdutoInputInterface = {
            texto: "",
            ativos: true,
            incluirImagens: true,
            incluirFamilias: false,
        };

        return this.produtosService.getProdutos(pesquisa, 1, 1).pipe(
            map((httpResponse) => {
                if (httpResponse.content.itens.length >= 1) {
                    return true;
                } else {
                    this.router.navigate(["produtos", "sem-produtos"]);
                    return false;
                }
            })
        );
    }
}
