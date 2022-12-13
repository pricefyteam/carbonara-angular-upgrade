import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";

@Component({
    selector: "cmp-confirma-exclusao",
    templateUrl: "./confirma-exclusao.component.html",
    styleUrls: ["./confirma-exclusao.component.scss"],
})
export class ConfirmaExclusaoComponent implements OnInit {
    public confirmed: Subject<boolean>;

    constructor(private _bsModalRef: BsModalRef) {}

    public ngOnInit(): void {
        this.confirmed = new Subject();
    }

    confirm(): void {
        this.confirmed.next(true);
        this._bsModalRef.hide();
    }

    cancel(): void {
        this.confirmed.next(false);
        this._bsModalRef.hide();
    }
}
