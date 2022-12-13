import { Component, OnInit } from "@angular/core";

import { AuthService } from "../../../../../pricefyfrontlib/app/core/auth/auth.service";
import { SettingsService } from "../../../../../pricefyfrontlib/app/core/settings/settings.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    constructor(public settings: SettingsService, public auth: AuthService) {}

    ngOnInit() {}
}
