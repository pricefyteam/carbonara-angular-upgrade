import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

@Component({
    selector: "cmp-search-input",
    templateUrl: "./search-input.component.html",
    styleUrls: ["./search-input.component.scss"],
})
export class SearchInputComponent implements OnInit {
    @Input("resetForm") public resetForm: boolean;
    @Input("placeholder") public placeholder: string = this.translateService.instant("SEARCH");
    @Input("searchAsYouType") public searchAsYouType: boolean = false;
    @Input("value") public value: string = "";
    @Output("search") public search = new EventEmitter<string>();
    public searchForm: FormGroup;
    public searchInput: FormControl = new FormControl("");
    public isInputFocus: boolean = false;

    constructor(private translateService: TranslateService) {}

    ngOnInit(): void {
        this.searchForm = new FormGroup({
            searchInput: this.searchInput,
        });

        this.searchInput.setValue(this.value);

        if (this.searchAsYouType) this.searchItems();
    }

    ngOnChanges() {
        if (this.resetForm) {
            this.searchInput.setValue("");
        }
    }

    private searchItems() {
        this.searchInput.valueChanges
            .pipe(
                debounceTime(500),
                filter((search) => search.length >= 3 || !search.length),
                distinctUntilChanged()
            )
            .subscribe((search) => {
                this.search.emit(search);
            });
    }

    public emitSearch() {
        this.search.emit(this.searchInput.value);
    }

    public resetSearch() {
        this.searchInput.setValue("");
    }

    public onFocus(isFocus: boolean) {
        this.isInputFocus = isFocus;
    }
}
