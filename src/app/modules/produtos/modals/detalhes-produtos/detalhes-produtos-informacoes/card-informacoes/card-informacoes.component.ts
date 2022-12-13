import { Component, Input, OnInit } from "@angular/core";
import {
    getInformacaoAdicionalAgrupadorItemValor,
    InformacaoAdicionalAgrupador,
    InformacaoAdicionalAgrupadorItem,
} from "../../../../../../@core/interfaces/entities/parametro-avancado.interface";
import { ProductsStore } from "../../../../../../@states/products/products.store";
import { ProductInterface } from "../../../../../../@states/@interfaces/product.interface";
import { Observable } from "rxjs";
import { __isNullOrUndefined } from "../../../../../../../../pricefyfrontlib/app/shared/helpers/functions";
import { EditarInfoComponent } from "../../../editar-info/editar-info.component";
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
    selector: "app-card-informacoes",
    templateUrl: "./card-informacoes.component.html",
    styleUrls: ["./card-informacoes.component.scss"],
})
export class CardInformacoesComponent implements OnInit {
    @Input("productCode") public productCode: string;
    @Input("agrupador") public agrupador: InformacaoAdicionalAgrupador;
    public product$: Observable<ProductInterface>;
    public getValue: Function = getInformacaoAdicionalAgrupadorItemValor;

    constructor(private bsModalService: BsModalService, private productsStore: ProductsStore) {}

    public ngOnInit(): void {
        this.product$ = this.productsStore.byCode$(this.productCode);
    }

    public edit(agrupador: InformacaoAdicionalAgrupador) {
        this.bsModalService.show(EditarInfoComponent, {
            initialState: { productCode: this.productCode, agrupador: agrupador },
            class: "modal-dialog-centered",
        });
    }
}
