import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../../pricefyfrontlib/app/core/auth/auth.service";
import { SettingsService } from "../../../../../pricefyfrontlib/app/core/settings/settings.service";

@Component({
    selector: "app-access-denied",
    templateUrl: "./access-denied.component.html",
    styleUrls: ["./access-denied.component.scss"],
})
export class AccessDeniedComponent implements OnInit {
    constructor(public settings: SettingsService, public auth: AuthService) {}

    ngOnInit() {}
}
