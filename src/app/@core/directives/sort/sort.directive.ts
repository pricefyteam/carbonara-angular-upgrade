import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from "@angular/core";

import { Sort } from "../../helpers/sort";

@Directive({
    selector: "[pimSort]",
})
export class SortDirective {
    @Input() pimSort: Array<any>;
    @Input() order: string = "asc";
    @Output() orderChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(private renderer: Renderer2, private targetElem: ElementRef) {}

    @HostListener("click")
    sortData() {
        const sort = new Sort();
        const elem = this.targetElem.nativeElement;
        const type = elem.getAttribute("data-type");
        const property = elem.getAttribute("data-name");
        if (this.order === "desc") {
            this.pimSort.sort(sort.startSort(property, this.order, type));
            this.order = "asc";
        } else {
            this.pimSort.sort(sort.startSort(property, this.order, type));
            this.order = "desc";
        }

        this.orderChange.emit(this.order);
    }
}
