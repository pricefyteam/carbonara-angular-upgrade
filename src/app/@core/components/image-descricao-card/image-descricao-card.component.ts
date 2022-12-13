import { Component, Input, OnInit } from "@angular/core";
import { __isEmpty } from "pricefyfrontlib/app/shared/helpers/functions";

import { FamilyInterface } from "../../../@states/@interfaces/family.interface";
import { ProductInterface } from "../../../@states/@interfaces/product.interface";

@Component({
    selector: "pim-image-descricao-card",
    templateUrl: "./image-descricao-card.component.html",
    styleUrls: ["./image-descricao-card.component.scss"],
})
export class ImageDescricaoCardComponent implements OnInit {
    @Input("item") public item: ProductInterface | FamilyInterface;
    @Input("showCode") public showCode: boolean = true;

    constructor() {}

    ngOnInit(): void {}

    get hasImage(): boolean {
        return !__isEmpty(this.item.urlThumbnailMain);
    }

    get isInactive(): boolean {
        if (this.item["active"] !== undefined && !this.item["active"]) {
            return true;
        }

        return false;
    }
}
