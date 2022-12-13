import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
    selector: "pim-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
    @Input() title: string;
    @Input() goBackUrl: string[] = [""];

    constructor(private router: Router, private bsModalService: BsModalService) {}

    ngOnInit(): void {}

    public goBack() {
        this.router.navigate(this.goBackUrl);
    }
}
