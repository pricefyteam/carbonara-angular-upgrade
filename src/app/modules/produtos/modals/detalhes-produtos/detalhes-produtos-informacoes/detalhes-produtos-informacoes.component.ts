import { Component, Input, OnInit } from "@angular/core";
import { ProductInterface } from "../../../../../@states/@interfaces/product.interface";
import { ClientesService } from "../../../../../@core/services/clientes.service";
import { Observable } from "rxjs";
import { InformacaoAdicionalAgrupador } from "../../../../../@core/interfaces/entities/parametro-avancado.interface";

@Component({
    selector: "app-detalhes-produtos-informacoes",
    templateUrl: "./detalhes-produtos-informacoes.component.html",
    styleUrls: ["./detalhes-produtos-informacoes.component.scss"],
})
export class DetalhesProdutosInformacoesComponent implements OnInit {
    @Input("productCode") public productCode: string;
    public agrupadores$: Observable<InformacaoAdicionalAgrupador[]>;

    constructor(private clientesService: ClientesService) {}

    public ngOnInit(): void {
        this.agrupadores$ = this.clientesService.getEstruturaInformacoesAdicionaisValor();
    }
}
