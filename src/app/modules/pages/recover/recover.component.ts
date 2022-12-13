import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "../../../../../pricefyfrontlib/app/core/settings/settings.service";

@Component({
    selector: "app-recover",
    templateUrl: "./recover.component.html",
    styleUrls: ["./recover.component.scss"],
})
export class RecoverComponent implements OnInit {
    valForm: FormGroup;

    constructor(public settings: SettingsService, fb: FormBuilder) {
        this.valForm = fb.group({
            email: [null, [Validators.required]],
        });
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            console.log("Valid!");
            console.log(value);
        }
    }

    ngOnInit() {}
}