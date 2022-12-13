import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../../pricefyfrontlib/app/core/auth/auth.service";
import { SettingsService } from "../../../../../pricefyfrontlib/app/core/settings/settings.service";

@Component({
    selector: "app-maintenance",
    templateUrl: "./maintenance.component.html",
    styleUrls: ["./maintenance.component.scss"],
})
export class MaintenanceComponent implements OnInit {
    constructor(public settings: SettingsService, public auth: AuthService) {}

    ngOnInit() {}
}
