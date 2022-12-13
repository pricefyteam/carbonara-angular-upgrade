import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PopoverComponent } from "pricefyfrontlib/app/shared/components/popover/popover.component";
import { __isNullOrUndefined } from "pricefyfrontlib/app/shared/helpers/functions";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { ProdutoInterface } from "src/app/@core/interfaces/entities/produto.interface";

import { FamiliaInterface } from "../../interfaces/entities/familia.interface";
import { HttpResponseInterface } from "../../interfaces/http-response.interface";
import { FamiliasService } from "../../services/familias.service";
import { ProdutosService } from "../../services/produtos.service";
import { PesquisaPaginadaOutputInterface } from "./../../interfaces/models/pesquisa-paginada-output.interface";
import { ItemInterface } from "./item.interface";
import { SearchTypesEnum } from "./search-types.enum";

@Component({
    selector: "cmp-select-produtos-familias",
    templateUrl: "./select-produtos-familias.component.html",
    styleUrls: ["./select-produtos-familias.component.scss"],
})
export class SelectProdutosFamiliasComponent implements OnInit, OnDestroy {
    @ViewChild("popoverComponent") public popoverComponent: PopoverComponent;
    @Input("readonly") public readonly: boolean = false;
    @Input("onlyProducts") public onlyProducts: boolean = false;
    @Input("forceInvalid") public forceInvalid: boolean = false;
    @Input("cleanSelectedItemAfterSelect") public cleanSelectedItemAfterSelect: boolean = false;
    @Input("selectedItem") public selectedItem: ItemInterface;
    @Input("autofocus") public autofocus: boolean = false;
    @Output("selectedItemChange") public selectedItemChange: EventEmitter<ItemInterface> = new EventEmitter<ItemInterface>();
    @Output("actionAddFamily") public actionAddFamily: EventEmitter<void> = new EventEmitter<void>();
    @ViewChild("inputProductFamily") inputProductFamily: ElementRef<HTMLInputElement>;

    public items: ItemInterface[] = [];
    public opened: boolean = false;
    public itemsLoading: boolean = false;
    public noItemsFound: boolean = false;
    public searchTypes: typeof SearchTypesEnum = SearchTypesEnum;
    public searchTypesSelected: SearchTypesEnum = SearchTypesEnum.product;
    private page: number = 1;
    private minimumTextValue: number = 3;

    public payload: FormGroup = new FormGroup({
        texto: new FormControl("", [Validators.required]),
        incluirImagens: new FormControl(true),
    });

    public constructor(
        private elementRef: ElementRef,
        private produtosService: ProdutosService,
        private familiasService: FamiliasService
    ) {}

    public ngOnInit(): void {
        this.search();
    }

    ngAfterViewInit() {
        if (this.autofocus) {
            setTimeout(() => {
                this.inputProductFamily.nativeElement.focus();
            }, 100);
        }
    }

    public ngOnDestroy() {}

    get texto() {
        return this.payload.get("texto");
    }

    get showAddFamily() {
        return !this.itemsLoading && this.searchTypesSelected === this.searchTypes.family && !__isNullOrUndefined(this.actionAddFamily);
    }

    get hasMinimumText() {
        return this.texto.value.length >= this.minimumTextValue;
    }

    public onSearchTypeChange($event) {
        this.items = [];
        this.selectItem(undefined);
        this.texto.setValue("");
        this.forceInvalid = false;
    }

    public clickableOnlyPermitOpen($event) {
        if (this.opened) {
            $event.stopImmediatePropagation();
        }

        this.forceInvalid = false;
    }

    public selectItem(item: ItemInterface) {
        this.selectedItem = item;
        this.selectedItemChange.emit(item);

        this.popoverComponent.setOpened(false);

        if (this.cleanSelectedItemAfterSelect) {
            this.selectedItem = undefined;
        }
    }

    public popoverOpenedChange(opened) {
        if (!opened) {
            if (this.selectedItem) {
                this.texto.setValue(this.selectedItem.labelCenter);
            } else {
                this.texto.setValue("");
            }
        } else {
            if (this.selectedItem) {
                this.texto.setValue("");
            }
        }
    }

    public search() {
        this.texto.valueChanges
            .pipe(
                debounceTime(500),
                filter((search) => search.length >= this.minimumTextValue),
                distinctUntilChanged()
            )
            .subscribe((search) => {
                this.page = 1;
                this.searchItems();
            });
    }

    private searchItems() {
        if (this.page === 1) {
            this.items = [];
        }

        this.itemsLoading = true;
        this.noItemsFound = false;

        let observableSearch;

        if (this.searchTypesSelected === SearchTypesEnum.product) {
            observableSearch = this.produtosService.getProdutos(this.payload.getRawValue(), this.page);
        } else {
            observableSearch = this.familiasService.getFamilias(this.payload.getRawValue(), this.page);
        }

        observableSearch.subscribe((httpResponse: HttpResponseInterface<PesquisaPaginadaOutputInterface<any>>) => {
            if (httpResponse.content && httpResponse.content.itens && httpResponse.content.itens.length >= 1) {
                if (this.searchTypesSelected === SearchTypesEnum.product) {
                    httpResponse.content.itens.forEach((produto) => {
                        this.items.push(this.transformProdutoIntoItem(produto));
                    });
                } else {
                    httpResponse.content.itens.forEach((familia) => {
                        this.items.push(this.transformFamiliaIntoItem(familia));
                    });
                }
            }

            this.itemsLoading = false;
            this.noItemsFound = this.items.length === 0 && this.page === 1;
        });
    }

    public transformProdutoIntoItem(produto: ProdutoInterface): ItemInterface {
        return {
            labelHeader: produto.codigo.toString(),
            labelCenter: `${produto.descricaoPrincipal} ${produto.descricaoSecundaria}`,
            labelFooter: produto.gtin,
            thumbnailURL: this.__getThumbnailURLFromImages(produto.imagens),

            type: SearchTypesEnum.product,
            primitive: produto,
        };
    }

    public transformFamiliaIntoItem(familia: FamiliaInterface): ItemInterface {
        return {
            labelHeader: familia.codigo,
            labelCenter: `${familia.descricaoPrincipal} ${familia.descricaoSecundaria}`,
            labelFooter: ``,
            thumbnailURL: this.__getThumbnailURLFromImages(familia.imagens),

            type: SearchTypesEnum.family,
            primitive: familia,
        };
    }

    private __getThumbnailURLFromImages(images: any[] = []) {
        if (images && images.length >= 1) {
            let principal = images.find((image) => image["principal"]);

            if (!__isNullOrUndefined(principal)) {
                return principal["urlThumbnail"] || principal["url"];
            } else if (!__isNullOrUndefined(images)) {
                return images[0]["urlThumbnail"] || images[0]["url"];
            }
        }

        return false;
    }

    public onScroll() {
        this.page++;
        this.searchItems();
    }
}
