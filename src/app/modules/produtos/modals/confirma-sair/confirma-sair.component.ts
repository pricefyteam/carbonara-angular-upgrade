import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
    selector: "app-confirma-sair",
    templateUrl: "./confirma-sair.component.html",
    styleUrls: ["./confirma-sair.component.scss"],
})
export class ConfirmaSairComponent implements OnInit {
    public onSuccess: Function;

    constructor(private _bsModalRef: BsModalRef) {}

    public ngOnInit(): void {}

    confirm(): void {
        this.onSuccess(this._bsModalRef);
        this._bsModalRef.hide();
    }

    cancel(): void {
        this._bsModalRef.hide();
    }
}
