import { Component, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";

import { FamiliasManipulacaoComponent } from "./../../modals/familias-manipulacao/familias-manipulacao.component";

@Component({
    selector: "app-sem-familias",
    templateUrl: "./sem-familias.component.html",
    styleUrls: ["./sem-familias.component.scss"],
})
export class SemFamiliasComponent implements OnInit {
    constructor(private bsModalService: BsModalService) {}

    ngOnInit(): void {}

    public abrirModalFamiliaManipulacao() {
        this.bsModalService.show(FamiliasManipulacaoComponent);
    }
}
