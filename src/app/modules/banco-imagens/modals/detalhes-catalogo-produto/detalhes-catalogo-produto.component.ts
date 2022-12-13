import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { __startDownloadByLink } from "src/app/@core/helpers/functions";

import { ProductInterface } from "../../../../@states/@interfaces/product.interface";
import { ProductsStore } from "../../../../@states/products/products.store";
import { ProvidersInterface } from "./../../../../@states/@interfaces/providers.interface";
import { ImagesEffects } from "./../../../../@states/images/images.effects";
import { ImagesStore } from "./../../../../@states/images/images.store";
import { ProvidersStore } from "./../../../../@states/providers/providers.store";

@Component({
    selector: "app-detalhes-catalogo-produto",
    templateUrl: "./detalhes-catalogo-produto.component.html",
    styleUrls: ["./detalhes-catalogo-produto.component.scss"],
})
export class DetalhesCatalogoProdutoComponent implements OnInit {
    public images$: Observable<any[]>;
    public product$: Observable<ProductInterface>;
    public processing: boolean = false;
    public grouperCopy: number;
    public codeProvider: string;
    public gtin: string;
    public form: FormGroup = new FormGroup({});

    constructor(
        private toastrService: ToastrService,
        private productsStore: ProductsStore,
        private translateService: TranslateService,
        public bsModalRef: BsModalRef,
        private imagesEffects: ImagesEffects,
        private imagesStore: ImagesStore,
        private providersStore: ProvidersStore
    ) {}

    ngOnInit(): void {
        this.imagesEffects.getImages({ gtin: this.gtin, codeProvider: this.codeProvider, component: this });
        this.images$ = this.imagesStore.byGtin$(this.gtin);
        this.product$ = this.productsStore.byGtin$(this.gtin);
    }

    public getImageControl(grouper: string): {} {
        if (!this.form.get(grouper)) {
            this.form.addControl(grouper, new FormControl(null));
        }

        return this.form.get(grouper);
    }

    public getProviderLogo(code: string): string {
        let urlThumbnail: string = "";
        this.providersStore.byCode$(code).subscribe((httpResponse: ProvidersInterface) => {
            if (httpResponse?.urlThumbnail) urlThumbnail = httpResponse.urlThumbnail;
        });

        return urlThumbnail;
    }

    public copyText(grouper: string) {
        const control = this.form.get(grouper).value;

        if (control !== null) {
            let selBox = document.createElement("textarea");
            selBox.style.position = "fixed";
            selBox.style.left = "0";
            selBox.style.top = "0";
            selBox.style.opacity = "0";
            selBox.value = control.url;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand("copy");
            document.body.removeChild(selBox);

            this.grouperCopy = control.grouper;
            this.toastrService.success(this.translateService.instant("URL_COPIED_SUCCESSFULLY"));
        } else {
            this.toastrService.warning(this.translateService.instant("SELECT_FORMAT_AND_DIMENSIONS"));
        }
    }

    public download(grouper: string) {
        const control = this.form.get(grouper).value;

        if (control !== null) {
            __startDownloadByLink(control.url, "download");
        } else {
            this.toastrService.warning(this.translateService.instant("SELECT_FORMAT_AND_DIMENSIONS"));
        }
    }

    public onChange() {
        this.grouperCopy = null;
    }
}
