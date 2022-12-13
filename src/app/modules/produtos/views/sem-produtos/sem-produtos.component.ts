import { Component, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
    selector: "app-sem-produtos",
    templateUrl: "./sem-produtos.component.html",
    styleUrls: ["./sem-produtos.component.scss"],
})
export class SemProdutosComponent implements OnInit {
    constructor(private bsModalService: BsModalService) {}

    ngOnInit(): void {}

    public abrirImportacaoProdutos() {
        window.open("/Admin/Produtos", "_blank");
    }
}
