import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { __startDownloadByLink } from "src/app/@core/helpers/functions";

import { FamilyInterface } from "../../../../@states/@interfaces/family.interface";
import { FamiliesEffects } from "../../../../@states/families/families.effects";
import { FamiliesStore } from "../../../../@states/families/families.store";
import { NormalizeImagePipe } from "./../../../../../../pricefyfrontlib/app/shared/pipes/normalize-image.pipe";
import { ProductFamilyImageInterface } from "./../../../../@states/@interfaces/product-family-image.interface";
import { ProductInterface } from "./../../../../@states/@interfaces/product.interface";
import { ProductsEffects } from "./../../../../@states/products/products.effects";
import { ProductsStore } from "./../../../../@states/products/products.store";

@Component({
    selector: "app-detalhes-produto-familia",
    templateUrl: "./detalhes-produto-familia.component.html",
    styleUrls: ["./detalhes-produto-familia.component.scss"],
})
export class DetalhesProdutoFamiliaComponent implements OnInit {
    public item$: Observable<FamilyInterface | ProductInterface>;
    public form: FormGroup = new FormGroup({});
    public processing: boolean = false;
    public grouperCopy: number;
    public itemCode: string;
    public type: string;

    constructor(
        private toastrService: ToastrService,
        private familiesStore: FamiliesStore,
        private familiesEffects: FamiliesEffects,
        private productsStore: ProductsStore,
        private productsEffects: ProductsEffects,
        private translateService: TranslateService,
        private normalizeImage: NormalizeImagePipe,
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit(): void {
        if (this.type === "produto") {
            this.item$ = this.productsStore.byCode$(this.itemCode);
            this.productsEffects.getProductByCode({
                code: this.itemCode,
                incluirImagens: true,
                incluirFamilia: false,
                incluirEstruturaMercadologica: false,
                incluirGtins: false,
                component: this,
            });
        } else {
            this.item$ = this.familiesStore.byCode$(this.itemCode);
            this.familiesEffects.getFamilyByCode({
                code: this.itemCode,
                incluirImagens: true,
                incluirProdutos: true,
                incluirImagensProduto: true,
                component: this,
            });
        }
    }

    public getImageControl(grouper: string, image: any): {} {
        if (!this.form.get(grouper)) {
            this.form.addControl(grouper, new FormControl(""));

            getWidthAndHeight(this.normalizeImage.transform(image.url), (url, width, height) => {
                const src: string = url.split(".").pop();
                this.form.get(grouper).setValue(`${src.toUpperCase()} - ${width} x ${height}`);
            });

            function getWidthAndHeight(url, callback) {
                const img = new Image();
                img.src = url;
                img.onload = function () {
                    callback(img.src, img.width, img.height);
                };
            }
        }

        return this.form.get(grouper);
    }

    public copyText(grouper: string, image: ProductFamilyImageInterface) {
        const control = this.form.get(grouper).value;

        if (control !== null) {
            let selBox = document.createElement("textarea");
            selBox.style.position = "fixed";
            selBox.style.left = "0";
            selBox.style.top = "0";
            selBox.style.opacity = "0";
            selBox.value = this.normalizeImage.transform(image.url);
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand("copy");
            document.body.removeChild(selBox);

            this.grouperCopy = image.id;
            this.toastrService.success(this.translateService.instant("URL_COPIED_SUCCESSFULLY"));
        } else {
            this.toastrService.warning(this.translateService.instant("SELECT_FORMAT_AND_DIMENSIONS"));
        }
    }

    public download(image: ProductFamilyImageInterface) {
        if (image !== null) {
            __startDownloadByLink(this.normalizeImage.transform(image.url), "download");
        } else {
            this.toastrService.warning(this.translateService.instant("SELECT_FORMAT_AND_DIMENSIONS"));
        }
    }
}
